import * as admin from "firebase-admin";
import { Message, RoomJoin, User } from "../models";
import { isValidImageURL } from "./utils";
import { InvalidPhotoURL } from "../customErrors";


admin.initializeApp({
  // GOOGLE_APPLICATION_CREDENTIALS environment variable
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://chatapp-58582.firebaseio.com'
});


const db = admin.firestore();


export async function addUser(user: admin.auth.UserInfo) {
  const usersRef = db.collection('users');
  const userExists: boolean = await usersRef.doc(user.uid).get().then(user => user.exists);

  if (!userExists) {
    const newUser: User = {
      id: user.uid,
      name: user.displayName,
      photoURL: user.photoURL
    }
    usersRef.doc(user.uid).set(newUser)
      .then(() => console.log(`New user created with userID ${user.uid}`))
      .catch(e => console.error(`Error: failed to create new user with userID ${user.uid}. ${e}`));;
  }
  else {
    console.error(`Error: failed to create new user with userID ${user.uid}. User already exists.`);
  }
};


export async function editUser(user: User) {
  const usersRef = db.collection('users');
  const userExists: boolean = await usersRef.doc(user.id).get().then(user => user.exists);

  if (userExists) {
    const isValidPhotoURL = await isValidImageURL(user.photoURL);
    if (!isValidPhotoURL) {
      throw new InvalidPhotoURL();
    }
    return usersRef.doc(user.id).set(user, { merge: true })
      .then(() => console.log(`User ${user.id} was edited`))
      .catch(e => console.error(`Error: user ${user.id} failed to be edited. ${e}`));
  }
}


export async function joinRoom(roomJoin: RoomJoin) {
  const roomRef = db.collection("rooms");

  return roomRef.doc(roomJoin.roomID).set({ users: admin.firestore.FieldValue.arrayUnion(roomJoin.userID) }, { merge: true })
    .then(() => console.log(`User ${roomJoin.userID} joined room ${roomJoin.roomID}`))
    .catch(e => console.error(`Error: user ${roomJoin.userID} failed to join room ${roomJoin.roomID}. ${e}`));
}


export async function addMessage(roomID: string, message: Message) {
  const roomRef = db.collection("rooms");

  const roomExists: boolean = await roomRef.doc(roomID).get().then(room => room.exists);

  if (roomExists) {
    const newMessage = roomRef.doc(roomID).collection("messages").doc();
    newMessage.create(message)
      .then(() => console.log(`New message ${newMessage.id} created in room ${roomID}`))
      .catch(e => console.error(`Error: failed to create new message in room ${roomID} from user ${message.userID}. ${e}`));
  }
}