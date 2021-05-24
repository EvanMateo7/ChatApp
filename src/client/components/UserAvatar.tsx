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
import Box from '@material-ui/core/Box';

export interface UserProps { user: User, logout: Function }

export const UserAvatar = (props: UserProps) => {
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
      <Box display="flex" justifyContent="center" alignItems="center" gridGap="5px" onClick={handleOpenMenu}>
        {
          (props.user && props.user.photoURL)
            ? <Avatar alt={props.user.name!} src={props.user.photoURL!} />
            : <MoodIcon></MoodIcon>
        }
        <Typography>{props.user?.name}</Typography>
      </Box>
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
