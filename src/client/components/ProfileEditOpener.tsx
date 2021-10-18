import React, { FunctionComponent } from 'react';
import { User } from '../../models';
import { ProfileEdit } from './ProfileEdit';

interface ProfileEditOpenerProps { user: User }

export const ProfileEditOpener: FunctionComponent<ProfileEditOpenerProps> = (props) => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <span style={{ cursor: "pointer" }} onClick={handleClickOpen}>
        {props.children}
      </span>
      {open && <ProfileEdit user={props.user} open={open} handleClose={handleClose} />}
    </>
  );
}
