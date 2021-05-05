import MoodIcon from '@material-ui/icons/Mood';
import Typography from "@material-ui/core/Typography";
import firebase from "firebase";
import React from "react";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

export interface UserProps { user: firebase.User }

const useStyles = makeStyles((theme) => ({
  userTag: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  userAvatar: {
    display: "flex",
    padding: 8,
  },
}));

export const User = (props: UserProps) => {
  
  const classes = useStyles();

  return (
    <div className={classes.userTag}>
      <div className={classes.userAvatar}>
      {
        props.user.photoURL
        ? <Avatar alt={props.user.displayName} src={props.user.photoURL} />
        : <MoodIcon></MoodIcon>
      }
      </div>
      <Typography>{props.user.displayName}</Typography>
    </div>
  );
}
