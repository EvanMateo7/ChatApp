import * as admin from "firebase-admin";
import { UserRefreshClient } from "google-auth-library";
import { Message, RoomJoin } from "../models";

admin.initializeApp({
  // GOOGLE_APPLICATION_CREDENTIALS environment variable
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://chatapp-58582.firebaseio.com'
});

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
    .catch( e => console.error(`${e} - source: firebaseServer.ts - addUser`));;
  }
  else {
    console.log(`User ${user.uid} already exists.`);
  }
};

export async function joinRoom(roomjoin: RoomJoin) {
  const roomRef = db.collection("rooms");
  
  return roomRef.doc(roomjoin.roomID).set({users: admin.firestore.FieldValue.arrayUnion(roomjoin.name)}, {merge: true})
    .then( () => console.log(`User "${roomjoin.name}" joined room ID: ${roomjoin.roomID}`))
    .catch( e => console.error(`${e} - source firebaseServer.ts - joinRoom`) );
}

export async function addMessage(roomID: string, message: Message) {
  const roomRef = db.collection("rooms");

  const roomExists: boolean = await roomRef.doc(roomID).get().then( room => room.exists );

  if(roomExists) {
    roomRef.doc(roomID).collection("messages").doc().create(message)
      .catch( e => console.error(`${e} - source firebaseServer.ts - addMessage`) );
    console.log(`Message saved: ${JSON.stringify(message)}`);
  }
}