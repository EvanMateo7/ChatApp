import { useState } from "react";
import { firebaseAuth, googleAuthProvider } from "./firebaseClient";
import firebase from "firebase/app";


export function useCurrentUser() {
  const [user, setUser] = useState<firebase.User | null>(null);

  firebaseAuth.onAuthStateChanged((firebaseUser) => {
    setUser(firebaseUser);
  });

  const logout = () => {
    firebaseAuth.signOut();
  }

  return [user, logout] as const;
}

export function googleLogin(): Promise<firebase.User | null | void> {
  return firebaseAuth.signInWithPopup(googleAuthProvider)
    .then( user => {
      return user.user;
    })
    .catch( e => {
        console.error(`${e} - source: firebaseClient.ts - googleLogin`);
    });
}
