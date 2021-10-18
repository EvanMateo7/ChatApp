import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from "react";
import { User } from '../../models';
import { ProfileEditOpener } from './ProfileEditOpener';
import { UserAvatar } from "./UserAvatar";

export interface UserProps { user: User, logout: Function }

const useStyles = makeStyles((theme) => ({
  menu: {
    "& *": {
      fontSize: "0.8rem"
    }
  },
  logout: {
    "&:hover": {
      backgroundColor: theme.palette.secondary.main
    }
  },
}));

export const AppBarUserAvatar = (props: UserProps) => {
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
        <UserAvatar user={props.user} />
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
        className={classes.menu}
      >
        <ProfileEditOpener user={props.user}>
          <MenuItem onClick={handleMenuClick()}>
            Edit Profile
          </MenuItem>
        </ProfileEditOpener>

        <Divider />

        <MenuItem className={classes.logout} onClick={handleMenuClick(props.logout)}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
