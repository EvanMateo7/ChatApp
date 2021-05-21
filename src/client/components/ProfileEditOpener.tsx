import React, { FunctionComponent, ReactElement, cloneElement } from 'react';
import { ProfileEdit } from './ProfileEdit';
import { User } from '../../models';

interface ProfileEditOpenerProps { user: User, children: ReactElement<{ onClick: any }> }

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
      {cloneElement(props.children, {
        onClick: () => {
          props.children.props.onClick && props.children.props.onClick()
          handleClickOpen();
        }
      })}
      <ProfileEdit user={props.user} open={open} handleClose={handleClose} />
    </>
  );
}
