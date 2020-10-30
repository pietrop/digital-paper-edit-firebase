const functions = require('firebase-functions');
const admin = require('firebase-admin');
const createTranscriptHandler = require('./createTranscript/index.js');
const firestoreCheckSTTHandler = require('./firestoreCheckSTT/index.js');

// firebase-admin module allows us to use the Firebase platform on a server with admin access, for instance to write to the Cloud Firestore or send FCM notifications.
admin.initializeApp();
const db = admin.firestore();

const AUDIO_EXTENSION = 'ogg';
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
