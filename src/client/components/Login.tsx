import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from "react";
import { googleLogin } from "../authService";

export const Login = (props: any) => {

  const login = () => {
    googleLogin().then( user => {
      if (user) {
        props.socket.emit('login', user);
      }
    });
  }

  return (
    <Box display="flex" alignItems="center"><Button color="inherit" onClick={login}><AccountCircleIcon />&nbsp;Google Sign In</Button></Box>
  );
}
