import * as admin from "firebase-admin";
import { Message, RoomJoin, User } from "../models";


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
    const newUser: User = {
      id: user.uid,
      name: user.displayName,
      photoURL: user.photoURL
    }
    usersRef.doc(user.uid).set(newUser)
      .then( () => console.log(`new user created with userID ${user.uid}`))
      .catch( e => console.error(`${e} - source: firebaseServer.ts - addUser`));;
  }
  else {
    console.error(`user ${user.uid} already exists.`);
  }
};


export async function editUser(user: User) {
  const usersRef = db.collection('users');
  const userExists: boolean = await usersRef.doc(user.id).get().then( user => user.exists);
  
  if(userExists) {
    // TODO: Validate photo url
    return usersRef.doc(user.id).set(user, {merge: true});
  }
}


export async function joinRoom(roomjoin: RoomJoin) {
  const roomRef = db.collection("rooms");
  
  return roomRef.doc(roomjoin.roomID).set({users: admin.firestore.FieldValue.arrayUnion(roomjoin.userID)}, {merge: true})
    .catch( e => console.error(`${e} - source firebaseServer.ts - joinRoom`) );
}


export async function addMessage(roomID: string, message: Message) {
  const roomRef = db.collection("rooms");

  const roomExists: boolean = await roomRef.doc(roomID).get().then( room => room.exists );

  if(roomExists) {
    roomRef.doc(roomID).collection("messages").doc().create(message)
      .catch( e => console.error(`${e} - source firebaseServer.ts - addMessage`) );
  }
}