import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from "react";
import * as firebase from "../firebaseClient";
import { User } from "./User";

export const Login = (props: any) => {

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
        : <Box display="flex" alignItems="center"><Button color="inherit" onClick={googleLogin}><AccountCircleIcon />&nbsp;Google Sign In</Button></Box>
      }
    </div>
  );
}
