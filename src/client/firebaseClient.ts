import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBY0UgjU--j4MOG8pOhnqvoU6x6nCSOCU8",
    authDomain: "chatapp-58582.firebaseapp.com",
    databaseURL: "https://chatapp-58582.firebaseio.com",
    projectId: "chatapp-58582",
    storageBucket: "",
    messagingSenderId: "522991633490",
    appId: "1:522991633490:web:303179d4fdf49654"
  };

// Objects
const firebaseInit = firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth();
const firestore = firebase.database();

// Functions
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters({
  prompt: 'select_account'
});

export function googleLogin() {
  return firebaseAuth.signInWithPopup(googleAuthProvider)
    .then( user => {
      return user.user;
    })
    .catch( e => {
        console.error(`${e} - Source: firebaseClient.ts`);
    });
}

export function sendMessage(roomID, user, message) {
  // TODO
}
console.log("Initialized FirebaseApp!");