// function deleteMedia(storageRefPath, bucket) {
//   const file = bucket.file(storageRefPath);
//   return file.delete();
// }
// //////////////////////////////////////////////////////////////////////////////
// exports.deleteTranscriptMediaForProject = functions.firestore.document('projects/{projectId}').onDelete(async (snap, context) => {
//   const defaultStorage = admin.storage();
//   const deletedValue = snap.data();
//   // iterate through projects transcripts to get the storageRef value
//   const bucket = defaultStorage.bucket();

//   deleteMedia(deletedValue.storageRefName, bucket);
//   deleteMedia(deletedValue.audioUrl, bucket);
//   return null;
// });
