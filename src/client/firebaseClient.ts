import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBY0UgjU--j4MOG8pOhnqvoU6x6nCSOCU8",
    authDomain: "chatapp-58582.firebaseapp.com",
    databaseURL: "https://chatapp-58582.firebaseio.com",
    projectId: "chatapp-58582",
    storageBucket: "",
    messagingSenderId: "522991633490",
    appId: "1:522991633490:web:303179d4fdf49654"
  };

export const firebaseInit = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

console.log("Initialized FirebaseApp!");