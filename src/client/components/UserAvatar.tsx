import MoodIcon from '@material-ui/icons/Mood';
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { User } from '../../models';
import { ProfileEditOpener } from './ProfileEditOpener';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

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

  const handleOpenMenu = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (func: Function = () => { }) => {
    return () => {
      handleMenuClose();
      func();
    }
  }

  const open = Boolean(anchorEl);

  return (
    <>
      <div onClick={handleOpenMenu}>
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
      <Menu
        keepMounted
        open={open}
        onClose={handleMenuClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={handleMenuClick(props.logout)}>Logout</MenuItem>
        <Divider />
        <ProfileEditOpener user={props.user}>
          <MenuItem onClick={handleMenuClick()}>
            Edit Profile
          </MenuItem>
        </ProfileEditOpener>
      </Menu>
    </>
  );
}
