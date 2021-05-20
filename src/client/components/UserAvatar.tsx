import MoodIcon from '@material-ui/icons/Mood';
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { User } from '../../models';

export interface UserProps { user: User, logout: Function }

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

export const UserAvatar = (props: UserProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  
  return (
    
    <>
      <div onClick={handleClick}> 
        <div className={classes.userTag}>
          <div className={classes.userAvatar}>
          {
            (props.user && props.user.photoURL)
            ? <Avatar alt={props.user.name!} src={props.user.photoURL!} />
            : <MoodIcon></MoodIcon>
          }
          </div>
          <Typography>{props.user?.name}</Typography>
        </div>
      </div>
      <Popover 
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Button color="secondary" variant="contained" size="small" onClick={() => props.logout()}>Logout</Button>
      </Popover>
    </>
  );
}
