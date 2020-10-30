# Firebase Cloud storage `getDownloadURL`

```js
const storage = firebase.storage();
const pathReference = storage.ref(tmpData.storageRefName);
// TODO: add error handling
const url = await pathReference.getDownloadURL();
```

- [Download Files on Web](https://firebase.google.com/docs/storage/web/download-files)

> **Firebase Storage tokens do not expire.**

They may be revoked from the Firebase Console, which would invalidate URLs based on them.

- [Firebase Storage getDownloadUrl's token validity](https://stackoverflow.com/questions/42593002/firebase-storage-getdownloadurls-token-validity)
