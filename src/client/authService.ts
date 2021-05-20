import { useState, useEffect } from "react";
import { firestore, firebaseAuth, googleAuthProvider } from "./firebaseClient";
import firebase from "firebase/app";
import { User } from "../models";


export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null);

  let subscribeUserDoc = (firebaseUID: string, once: boolean = false) => {
    const unsubscribeUserDoc = firestore.collection("users")
        .doc(firebaseUID)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            setUser(() => {
              once && unsubscribeUserDoc();
              return snapshot.data() as User;
            });
          }
        });
    
    return unsubscribeUserDoc;
  }

  useEffect(() => {
    const unsubscribeAuth = firebaseAuth.onAuthStateChanged((user) => {
      if (!user) {
        setUser(null);
        setFirebaseUser(null);
        return;
      }
      subscribeUserDoc(user.uid, true);
      setFirebaseUser(user);
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      const unsubscribeUserDoc = subscribeUserDoc(firebaseUser.uid);

      return unsubscribeUserDoc;
    }
  }, [firebaseUser]);

  const logout = () => {
    firebaseAuth.signOut();
  }

  return [user, logout] as const;
}


export function googleLogin(): Promise<firebase.User | null | void> {
  return firebaseAuth.signInWithPopup(googleAuthProvider)
    .then(user => {
      return user.user;
    })
    .catch(e => {
      console.error(`${e} - source: firebaseClient.ts - googleLogin`);
    });
}
