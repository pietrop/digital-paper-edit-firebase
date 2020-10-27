function deleteMedia(storageRefPath, bucket) {
  const file = bucket.file(storageRefPath);
  return file.delete();
}

exports.createHandler = async (snap, context, admin) => {
  const defaultStorage = admin.storage();
  const deletedValue = snap.data();
  const storageRefPath = deletedValue.storageRefName;
  const bucket = defaultStorage.bucket();
  await deleteMedia(storageRefPath, bucket);
  const storageRefPathAudioPreview = deletedValue.audioUrl;
  await deleteMedia(storageRefPathAudioPreview, bucket);
  return null;
};
