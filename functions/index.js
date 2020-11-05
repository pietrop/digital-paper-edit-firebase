const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const createTranscriptHandler = require('./createTranscript/index.js');
const firestoreCheckSTTHandler = require('./firestoreCheckSTT/index.js');
const convertToVideo = require('./convert-to-video/index.js');
const remix = require('./ffmpeg-remix/index.js');
// firebase-admin module allows us to use the Firebase platform on a server with admin access, for instance to write to the Cloud Firestore or send FCM notifications.
admin.initializeApp();
const db = admin.firestore();

const AUDIO_EXTENSION = 'ogg';
const AUDIO_EXTENSION_VIDEO = 'mp4';
const SAMPLE_RATE_HERTZ = 16000; // or 48000
const MAX_RUNTIME_OPTS = {
  timeoutSeconds: 540, // 9 minutes
  memory: '2GB',
};
// TODO: Google cloud function triggers Goolge Cloud task
//  Goolge Cloud task calls cloud function that calls STT SDK
// this function returns null.
// timeout 1min to 9min https://cloud.google.com/functions/docs/concepts/exec#timeout
// https://firebase.google.com/docs/functions/firestore-events
exports.createTranscript = functions
  .runWith(MAX_RUNTIME_OPTS)
  .firestore.document('projects/{projectId}/transcripts/{transcriptId}')
  .onCreate(async (change, context) => {
    return await createTranscriptHandler.createHandler(change, context, admin, AUDIO_EXTENSION, SAMPLE_RATE_HERTZ);
  });

// function to retrieve STT data from GCP STT operation
// does this    ?
exports.firestoreCheckSTT = functions.runWith(MAX_RUNTIME_OPTS).https.onRequest(async (req, res) => {
  return await firestoreCheckSTTHandler.createHandler(req, res, admin, functions);
});

// https://firebase.google.com/docs/functions/gcp-storage-events
exports.onNewTranscriptConvertToMp4Preview = functions
  .runWith(MAX_RUNTIME_OPTS)
  .firestore.document('projects/{projectId}/transcripts/{transcriptId}')
  .onCreate(async (change, context) => {
    const VIDEO_PRREVIEW_PREFIX_NAME = '_preview_video';
    // functions
    //   .runWith(MAX_RUNTIME_OPTS)
    //   .storage.object()
    //   .onMetadataUpdate(async object => {

    // const bucket = admin.storage().bucket();
    // const bucket = object.bucket; // The Storage bucket that contains the file.
    // const filePath = object.name; // File path in the bucket.
    // const contentType = object.contentType; // File content type.
    // const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    const newValue = change.data();
    // access a particular field as you would any JS property
    // let storageRef = newValue.storageRefName;
    const storageRef = newValue.storageRefName;
    const downloadURLLink = newValue.downloadURL;
    // const storage = admin.storage();
    // const bucket = storage.appInternal.options.storageBucket;
    const bucket = admin.storage().bucket();
    const filePath = downloadURLLink;

    const fileName = path.basename(filePath);
    // const clipName = path.basename(storageRef);
    // if (fileName.endsWith('_preview.ogg')) {
    const targetTempFileName = fileName.replace(/\.[^/.]+$/, '') + `${VIDEO_PRREVIEW_PREFIX_NAME}.${AUDIO_EXTENSION_VIDEO}`;
    const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
    const targetStorageFilePath = path.join(path.dirname(storageRef), targetTempFileName);

    // var storage = firebase.storage();
    // const storage = admin.storage();
    // const storageRef = storage.ref();
    // const fileRef = storageRef.child(filePath);
    // const metadata = await fileRef.getMetadata();
    // Metadata now contains the metadata for 'images/forest.jpg'
    // const projectId = metadata.customMetadata.projectId;
    // const transcriptId = metadata.customMetadata.transcriptId;

    // const db = admin.firestore();
    // const docRef = db
    //   .collection('projects')
    //   .doc(projectId)
    //   .collection('transcripts')
    //   .doc(transcriptId);

    const newFile = await convertToVideo({
      src: filePath,
      outputFullPathName: targetTempFilePath,
    });

    console.log('newFile', newFile);

    await bucket.upload(targetTempFilePath, {
      destination: targetStorageFilePath,
      // without resumable false, this seems to fail
      resumable: false,
    });

    change.ref.set(
      {
        videoUrl: targetStorageFilePath,
        // clipName,
        path: filePath,
      },
      {
        merge: true,
      }
    );
    // Once the mp4 has been uploaded delete the local file to free up disk space.
    fs.unlinkSync(targetTempFilePath);

    return null;
    // } else {
    // return null;
    // }
  });

exports.onDeleteTranscriptCleanUp = functions
  .runWith(MAX_RUNTIME_OPTS)
  .firestore.document('projects/{projectId}/transcripts/{transcriptId}')
  .onDelete(async (snap, context) => {
    const projectId = context.params.projectId;
    const transcriptId = context.params.transcriptId;
    // delete annotations for project being deleted
    const annotationsRef = db
      .collection('projects')
      .doc(projectId)
      .collection('transcripts')
      .doc(transcriptId)
      .collection('annotations');

    await annotationsRef
      .get()
      .then(querySnapshot => {
        return querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
        // TODO: does it need to reject?
        reject(error);
      });

    // delete meida associated with project in cloud storage
    function deleteMedia(storageRefPath, bucket) {
      const file = bucket.file(storageRefPath);
      return file.delete();
    }
    const defaultStorage = admin.storage();
    const deletedValue = snap.data();
    const storageRefPath = deletedValue.storageRefName;
    const bucket = defaultStorage.bucket();
    await deleteMedia(storageRefPath, bucket);
    const storageRefPathAudioPreview = deletedValue.audioUrl;
    await deleteMedia(storageRefPathAudioPreview, bucket);
    const storageRefPathVideoPreview = deletedValue.videoUrl;
    await deleteMedia(storageRefPathVideoPreview, bucket);
    return null;
  });

exports.onDeleteProjectCleanUp = functions
  .runWith(MAX_RUNTIME_OPTS)
  .firestore.document('projects/{projectId}')
  .onDelete(async (snap, context) => {
    const projectId = context.params.projectId;
    // Delete labels
    const labelsRef = db
      .collection('projects')
      .doc(projectId)
      .collection('labels');

    await labelsRef
      .get()
      .then(querySnapshot => {
        return querySnapshot.forEach(doc => {
          // Add the individual transcript firebase id to the data
          doc.ref.delete();
        });
        // TODO: does it need to resolve?
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
        // TODO: does it need to reject?
      });

    // Delete paper edits
    const paperEditsRef = db
      .collection('projects')
      .doc(projectId)
      .collection('paperedits');

    await paperEditsRef
      .get()
      .then(querySnapshot => {
        return querySnapshot.forEach(doc => {
          // Add the individual transcript firebase id to the data
          doc.ref.delete();
        });
        // TODO: does it need to resolve?
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
        // TODO: does it need to reject?
      });

    // Delete transcripts
    const transcriptRef = db
      .collection('projects')
      .doc(projectId)
      .collection('transcripts');

    await transcriptRef
      .get()
      .then(querySnapshot => {
        return querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
        // TODO: does it need to resolve?
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
        // TODO: does it need to reject?
        reject(error);
      });
  });

// https://firebase.google.com/docs/functions/callable#web
// https://github.com/pietrop/digital-paper-edit-electron/blob/master/src/ElectronWrapper/ffmpeg-remix/index.js
exports.ffmpegRemixVideo = functions.runWith(MAX_RUNTIME_OPTS).https.onCall(async (data, context) => {
  console.log('data', JSON.stringify(data));
  const bucket = admin.storage().bucket();
  const fileName = data.output;

  const localFileNamePath = path.join(os.tmpdir(), data.output);
  data.output = localFileNamePath;
  console.log('data.output', data.output);
  await remix(data, null, null, null, async (err, result) => {
    if (err) {
      console.log('err', err);
      // reject(err);
      return err;
    }
    console.log('result', JSON.stringify(result));
    console.log('result.path', result.path);
    console.log('fileName', fileName);
    // const targetTempFilePath = result.path;
    // TODO: change this name
    // const targetStorageFilePath = result.path;

    // TODO: get projectId, to set the folder in destination
    // when adding to the bucket
    await bucket.upload(data.output, {
      destination: fileName,
      // without resumable false, this seems to fail
      resumable: false,
    });
    // TODO:
    // fs.unlinkSync(targetTempFilePath);
    // TODO: save to `_export.mp4` to cloud storage
    // create downloadUrl
    // return downloadUrl
    // resolve(result);
    return result;
  });
  // ...
});

// exports.ffmpegRemixAudio = functions.https.onCall((data, context) => {
//   console.log('data', data);
//   // ...
// });
