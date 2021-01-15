```js
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
function isVerified(){
return request.auth!= null && request.auth.token.email_verified
}

 function isValidDJEmail(){
return request.auth.token.email.matches('._@dowjones[.]com\$')
}

 function isValidWSJEmail(){
return request.auth.token.email.matches('._@wsj[.]com$')
      }

      function isValidEmail(){
					return isVerified() && (isValidWSJEmail() || isValidDJEmail())
			}

    	function readWriteAccess(database,pId) {
    	 return get(/databases/$(database)/documents/projects/\$(pId)).data.roles[request.auth.token.email] == 'owner';
}

 match /projects/{pId}/{document=**} {
allow read, write: if isValidEmail() && readWriteAccess(database,pId);
}


// This is here to match /project root collection, coz without { doesn't seem to work
match /{document=**}{
// TODO: see if this needs to be made more secure
allow read, write: if isValidEmail();
 }

 }
}
```
