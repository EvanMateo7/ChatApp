import { faLaugh } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase";
import React from "react";

export interface UserProps { user: firebase.User }

export const User = (props: UserProps) => {
  return (
    <div className="user_tag">
      <div className="user_picture">
      {
        props.user.photoURL
        ? <img className="user_picture" src={props.user.photoURL}/>
        : <FontAwesomeIcon  icon={faLaugh} size="2x" />
      }
      </div>
      <div className="user_name">{props.user.displayName}</div>
    </div>
  );
}
