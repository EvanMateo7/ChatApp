import * as admin from "firebase-admin";
import { UserRefreshClient } from "google-auth-library";

admin.initializeApp({
  // GOOGLE_APPLICATION_CREDENTIALS environment variable
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://chatapp-58582.firebaseio.com'
});
;
const db = admin.firestore();

export async function addUser(user: admin.auth.UserInfo) {
  const usersRef = db.collection('users');

  const userExists: boolean = await usersRef.doc(user.uid).get().then( user => user.exists);
      
  if(!userExists) {
    usersRef.doc(user.uid).set({
      id: user.uid,
      name: user.displayName
    })
    .then( () => console.log(`New user created with UID ${user.uid}`))
    .catch( e => console.error(`${e} - Source: firebaseServer.ts`));
  }
  else {
    console.log(`User ${user.uid} already exists.`);
  }
};