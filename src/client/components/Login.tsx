import React from "react";
import * as firebase from "../firebaseClient";
import { User } from "./User";

export const Login = (props) => {

  const googleLogin = () => {
    firebase.googleLogin().then( user => {
      if (user) {
        props.socket.emit('login', user);
        props.setUser(user);
      }
    });
  }

  return (
    <div>
      {
        props.user
        ? <User user={props.user} />
        : <button id="googleSignInButton" onClick={googleLogin}>Google Sign In</button>
      }
    </div>
  );
}
