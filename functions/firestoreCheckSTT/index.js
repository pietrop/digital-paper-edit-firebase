const { CloudTasksClient } = require('@google-cloud/tasks');
const fetch = require('node-fetch');
const gcpToDpe = require('gcp-to-dpe');
const { serializeTranscript } = require('@pietrop/serialize-stt-words');
const { getSttOperationUrl } = require('./get-stt-operation-url');
const { getSecondsSinceEpoch } = require('../createTranscript/seconds-since-epoch');
const { addMinutes } = require('../createTranscript/add-minutes');

exports.createHandler = async (req, res, admin, functions) => {
  const payload = req.body;
  functions.logger.log('payload', payload);
  functions.logger.log('payload typeof', typeof payload);
  // Does this work or does it need some processing like, JSON.parse etc..?
  const { sttOperationName, docPath } = payload;
  functions.logger.log('sttOperationName', sttOperationName);
  functions.logger.log('docPath', docPath);
  try {
    // await admin.firestore().doc(payload.docPath).delete();
    // TODO: add firebaseApiKey to ENV
    // https://stackoverflow.com/questions/34442739/how-does-one-set-private-environment-variables-on-firebase-hosting
    const firebaseApiKey = functions.config().webapi.key;
    const operationUrlEndPoint = getSttOperationUrl(sttOperationName, firebaseApiKey);
    return fetch(operationUrlEndPoint)
      .then((response) => response.json())
      .then(async (resp) => {
        functions.logger.log('resp', resp);
        if (resp.error) {
          await admin.firestore().doc(docPath).set(
            {
              status: 'error',
              error: resp.error,
            },
            {
              merge: true,
            }
          );
          return await res.sendStatus(500);
        }
        if (resp.done && resp.response) {
          //  functions.logger.log(resp);
          // TODO: save data to firestore
          // resp.response.result
          //  functions.logger.log('transcript');
          const transcript = gcpToDpe(resp);
          const {
            wordStartTimes,
            wordEndTimes,
            textList,
            paragraphStartTimes,
            paragraphEndTimes,
            speakersLit,
          } = serializeTranscript(transcript);

          //  functions.logger.log('transcript', transcript);
          functions.logger.log('transcript gcpToDpe');
          const { paragraphs, words } = transcript;
          functions.logger.log('transcript words');
          functions.logger.log('docPath', docPath);

          const transcriptRef = admin.firestore().doc(docPath);

          await transcriptRef
            .collection('words')
            .doc('wordStartTimes')
            .set(
              {
                wordStartTimes: JSON.stringify(wordStartTimes),
              },
              {
                merge: true,
              }
            );

          await transcriptRef
            .collection('words')
            .doc('wordEndTimes')
            .set(
              {
                wordEndTimes: JSON.stringify(wordEndTimes),
              },
              {
                merge: true,
              }
            );

          await transcriptRef
            .collection('words')
            .doc('textList')
            .set(
              {
                textList: JSON.stringify(textList),
              },
              {
                merge: true,
              }
            );

          await transcriptRef
            .collection('words')
            .doc('paragraphStartTimes')
            .set(
              {
                paragraphStartTimes: JSON.stringify(paragraphStartTimes),
              },
              {
                merge: true,
              }
            );

          await transcriptRef
            .collection('words')
            .doc('paragraphEndTimes')
            .set(
              {
                paragraphEndTimes: JSON.stringify(paragraphEndTimes),
              },
              {
                merge: true,
              }
            );

          await transcriptRef
            .collection('words')
            .doc('speakersLit')
            .set(
              {
                speakersLit: JSON.stringify(speakersLit),
              },
              {
                merge: true,
              }
            );

          // await transcriptRef.collection('words').doc('words').set(
          //   {
          //     words,
          //   },
          //   {
          //     merge: true,
          //   }
          // );

          // await transcriptRef.collection('paragraphs').doc('paragraphs').set(
          //   {
          //     paragraphs,
          //   },
          //   {
          //     merge: true,
          //   }
          // );

          await transcriptRef.set(
            {
              // paragraphs,
              // words,
              status: 'done',
              sttEngine: 'GoogleCloud-video',
            },
            {
              merge: true,
            }
          );

          functions.logger.log('admin write');
          return res.sendStatus(200);
        } else {
          // // TODO: try this in cloud function to see if can get progress through to client
          // if (resp && resp.metadata && resp.metadata.progressPercent) {
          //   await admin
          //     .firestore()
          //     .doc(docPath)
          //     .set(
          //       {
          //         sttProgressPercent: resp.metadata.progressPercent,
          //       },
          //       {
          //         merge: true,
          //       }
          //     );
          // }
          functions.logger.log('else, not ready - trying task again!');
          //TODO: run cloud task
          const project = admin.instanceId().app.options.projectId;
          // https://firebase.google.com/docs/functions/locations
          const location = 'us-central1';
          const queue = 'firestore-stt';
          const tasksClient = new CloudTasksClient();
          const queuePath = tasksClient.queuePath(project, location, queue);
          const url = `https://${location}-${project}.cloudfunctions.net/firestoreCheckSTT`;
          functions.logger.log('url firestoreCheckSTT', url);
          //  const payload = { sttOperationName, docPath };
          // time of expiration expressed in epoch seconds
          const now = new Date();
          const timeFromNowWhenToCheckAgainInMinutes = 5;
          const timeFromNowWhenToCheckAgainAsDate = addMinutes(
            now,
            timeFromNowWhenToCheckAgainInMinutes
          );
          // Epoch, also known as Unix timestamps, is the number of seconds (not milliseconds!) that have elapsed since January 1, 1970 at 00:00:00 GMT
          const secondsSinceEpoch = getSecondsSinceEpoch(timeFromNowWhenToCheckAgainAsDate);

          await admin.firestore().doc(docPath).set(
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
          const [response] = await tasksClient.createTask({ parent: queuePath, task });
          functions.logger.log(`Created task ${response.name}`);
          return res.sendStatus(200);
        }
      });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
