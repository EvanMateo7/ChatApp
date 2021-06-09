import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import React from "react";
import { User } from '../../models';

interface ChatUserAvatarProps { user: User }

export const ChatUserAvatar = (props: ChatUserAvatarProps) => {

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gridGap="5px" >
      <Avatar alt={props.user?.name} src={props.user?.photoURL} />
      <div>{props.user?.name}</div>
    </Box>
  );
}
