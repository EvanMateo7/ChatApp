import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import React from "react";
import { User } from '../../models';

export interface UserProps { user: User, onClick?: Function }

export const UserAvatar = (props: UserProps) => {

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gridGap="5px" maxWidth={200}
    onClick={(e) => props.onClick && props.onClick(e)}>
      <Avatar alt={props.user?.name} src={props.user?.photoURL} />
      <Typography variant="body2" noWrap>{props.user?.name}</Typography>
    </Box>
  );
}
