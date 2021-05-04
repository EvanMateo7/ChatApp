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
        : <button className="btn btn-info" onClick={googleLogin}>Google Sign In</button>
      }
    </div>
  );
}
