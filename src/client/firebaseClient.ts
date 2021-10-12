import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "../firebase.config.json";


// Setup
const firebaseInit = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firestore = firebase.firestore();

// Functions
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters({
  prompt: 'select_account'
});

console.log("Initialized FirebaseApp!");
