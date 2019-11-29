import * as admin from "firebase-admin";
import { UserRefreshClient } from "google-auth-library";
import { RoomJoin } from "../model/models";

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
    .catch( e => console.error(`${e} - Source: sfirebaseServer.ts`));;
  }
  else {
    console.log(`User ${user.uid} already exists.`);
  }
};

export async function joinRoom(roomjoin: RoomJoin) {
  const roomRef = db.collection("rooms");
  
  await roomRef.doc(roomjoin.roomID).set({users: admin.firestore.FieldValue.arrayUnion(roomjoin.name)}, {merge: true})
    .then( () => console.log(`Room created with ID: ${roomjoin.roomID}`))
    .catch( e => console.error(`${e} - Source ssfirebaseServer.ts`) );
 
  roomRef.doc(roomjoin.roomID).collection("messages").doc("0").create({})
    .catch( e => console.error(`${e} - Source ssfirebaseServer.ts`) );
}

export async function storeMessage(roomID, message) {
  const roomRef = db.collection("rooms");

  const roomExists: boolean = await roomRef.doc(roomID).get().then( room => room.exists );

  if(roomExists) {
    roomRef.doc(roomID).collection("messages").doc().create(message)
      .catch( e => console.error(`${e} - Source sssfirebaseServer.ts`) );
    console.log(`Message saved: ${message}`);
  }
}