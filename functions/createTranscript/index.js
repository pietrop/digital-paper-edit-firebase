const speech = require('@google-cloud/speech');
const { CloudTasksClient } = require('@google-cloud/tasks');
const gcpToDpe = require('gcp-to-dpe');
const { serializeToTsv } = require('@pietrop/words-tsv-serializer');
const { addMinutes } = require('./add-minutes');
const { getSecondsSinceEpoch } = require('./seconds-since-epoch');
const { convertToAudio } = require('./convertToAudio');
const { readMetadataForEDL } = require('./av-metadata-reader/index.js');

exports.createHandler = async (change, context, admin, AUDIO_EXTENSION, SAMPLE_RATE_HERTZ) => {
  // Get an object representing the document
  const newValue = change.data();
  // access a particular field as you would any JS property
  let storageRef = newValue.storageRefName;
  const downloadURLLink = newValue.downloadURL;
  // https://firebase.google.com/docs/storage/admin/start
  const storage = admin.storage();
  // https://github.com/firebase/firebase-tools/issues/1573#issuecomment-517000981
  const bucket = storage.appInternal.options.storageBucket;

  // Read metadata
  const metadataRes = await readMetadataForEDL({
    file: downloadURLLink,
  });

  change.ref.set(
    {
      metadata: metadataRes,
    },
    {
      merge: true,
    }
  );
  // end Read metadata

  // Convert video or audio to audio that meets GCP STT Specs
  const audioForSttRef = await convertToAudio(admin, storageRef, downloadURLLink, AUDIO_EXTENSION, SAMPLE_RATE_HERTZ);
  // save audio ref to firestore
  change.ref.set(
    {
      audioUrl: audioForSttRef,
    },
    {
      merge: true,
    }
  );

  // STT
  const client = new speech.SpeechClient();
  const request = {
    config: {
      // https://cloud.google.com/speech-to-text/docs/async-time-offsets
      enableWordTimeOffsets: true,
      // https://cloud.google.com/speech-to-text/docs/automatic-punctuation
      enableAutomaticPunctuation: true,
      // https://cloud.google.com/speech-to-text/docs/multiple-voices
      enableSpeakerDiarization: true,
      diarizationConfig: {
        enableSpeakerDiarization: true,
        //  If not set, the default value is 2.
        // minSpeakerCount: 2,
        //  If not set, the default value is 6.
        // maxSpeakerCount: 3,
      },
      encoding: 'OGG_OPUS',
      // in RecognitionConfig must either be unspecified or match the value in the FLAC header `16000`;
      sampleRateHertz: Number(SAMPLE_RATE_HERTZ).toString(),
      languageCode: 'en-US',
      // https://cloud.google.com/speech-to-text/docs/multiple-languages
      // alternativeLanguageCodes: ['es-ES', 'en-US'],
      // https://cloud.google.com/speech-to-text/docs/reference/rest/v1p1beta1/RecognitionConfig
      // https://cloud.google.com/blog/products/gcp/toward-better-phone-call-and-video-transcription-with-new-cloud-speech-to-text
      model: 'video',
    },
    audio: {
      uri: `gs://${bucket}/${audioForSttRef}`,
    },
  };

  // https://cloud.google.com/speech-to-text/docs/async-recognize
  // > Asynchronous speech recognition starts a long running audio processing operation.
  // > Use asynchronous speech recognition to transcribe audio that is longer than 1 minute
  // if (metadataRes.duration && metadataRes.duration <= 60) {
  //   const [shortResponse] = await client.recognize(request);
  //   //  const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
  //   //  console.log('Transcription: ', transcription);
  //   const transcript = gcpToDpe(shortResponse);
  //   const { paragraphs, words } = transcript;
  //   return change.ref.set(
  //     {
  //       paragraphs,
  //       words,
  //       status: 'done',
  //     },
  //     {
  //       merge: true,
  //     }
  //   );
  // } else {
  // This creates a recognition job that you can wait for now, or get its result later.
  // initialApiResponse.name is the operation name/"id"
  // initialApiResponse.done is the status of the operation
  const [operation, initialApiResponse] = await client.longRunningRecognize(request);
  console.log('initialApiResponse', initialApiResponse.name);

  const sttOperationName = initialApiResponse.name;
  const sttOperationStatus = initialApiResponse.done;

  // TODO: I don't think the first response will have just have the results as is?
  if (sttOperationStatus && initialApiResponse.response && initialApiResponse.response.results) {
    //  const [response] = await operation.promise();
    const transcript = gcpToDpe(initialApiResponse);
    const { paragraphs, words } = transcript;
    const tsv = serializeToTsv(words);
    change.ref
      .collection('words')
      .doc('words')
      .set(
        {
          words: tsv,
        },
        {
          merge: true,
        }
      );

    change.ref
      .collection('paragraphs')
      .doc('paragraphs')
      .set(
        {
          paragraphs,
        },
        {
          merge: true,
        }
      );

    return change.ref.set(
      {
        // paragraphs,
        // words,
        status: 'done',
        // sttEngine: 'GoogleCloud',
        sttEngine: 'GoogleCloud-video',
      },
      {
        merge: true,
      }
    );
  } else {
    // Start a cloud task that triggers cloud function to check progress of GCP STT operation at latest stage
    const project = admin.instanceId().app.options.projectId;
    // https://firebase.google.com/docs/functions/locations
    const location = 'us-central1';
    const queue = 'firestore-stt';

    const tasksClient = new CloudTasksClient();
    const queuePath = tasksClient.queuePath(project, location, queue);

    const url = `https://${location}-${project}.cloudfunctions.net/firestoreCheckSTT`;
    console.log('url firestoreCheckSTT', url);
    const docPath = change.ref.path;

    const payload = { sttOperationName, docPath };

    // time of expiration expressed in epoch seconds
    const now = new Date();
    const timeFromNowWhenToCheckAgainInMinutes = 5;
    const timeFromNowWhenToCheckAgainAsDate = addMinutes(now, timeFromNowWhenToCheckAgainInMinutes);
    // Epoch, also known as Unix timestamps, is the number of seconds (not milliseconds!) that have elapsed since January 1, 1970 at 00:00:00 GMT
    const secondsSinceEpoch = getSecondsSinceEpoch(timeFromNowWhenToCheckAgainAsDate);

    // For troubleshooting
    change.ref.set(
      {
        sttOperationName,
        nextSttProgressCheckAt: timeFromNowWhenToCheckAgainAsDate,
      },
      {
        merge: true,
      }
    );

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url,
        body: Buffer.from(JSON.stringify(payload)).toString('base64'),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      scheduleTime: {
        seconds: secondsSinceEpoch,
      },
    };
    const [response] = await tasksClient.createTask({
      parent: queuePath,
      task,
    });
    console.log(`Created task ${response.name}`);
    return null;
  }
  // }
};
