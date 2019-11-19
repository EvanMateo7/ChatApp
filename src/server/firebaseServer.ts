import * as admin from "firebase-admin";

admin.initializeApp({
  // GOOGLE_APPLICATION_CREDENTIALS environment variable
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://chatapp-58582.firebaseio.com'
});
;
const db = admin.firestore();

export function addUser(UID:String, displayName:String) {
  db.collection('users').doc().set({
    id: UID,
    name: displayName
  }).then( () => console.log(`User logged in with UID ${UID}`))
  .catch( e => console.error(`Error: ${e}`));
};