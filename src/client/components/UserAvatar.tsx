import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import React from "react";
import { User } from '../../models';

export interface UserProps { user: User, vertical?: boolean }

export const UserAvatar = ({vertical = false, ...props}: UserProps) => {

  const direction = vertical ? 'column' : 'row';

  return (
    <Box display="flex" flexDirection={direction} justifyContent="center" alignItems="center" gridGap="5px" maxWidth={200}>
      <Avatar alt={props.user?.name} src={props.user?.photoURL} />
      <Typography variant="body2" noWrap>{props.user?.name}</Typography>
    </Box>
  );
}
