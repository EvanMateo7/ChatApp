import { ClickAwayListener, Popper, Box } from "@material-ui/core"
import React, { ReactElement, useState } from "react"
import { User } from "../../models";

interface UserInfoPopperProps { children: ReactElement, user: User, side: 'left-start' | 'right-start' }

export const UserInfoPopper = (props: UserInfoPopperProps) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickOpen = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div onClick={handleClickOpen}>
        {props.children}
      </div>
      {
        open
        &&
        <ClickAwayListener onClickAway={handleClose}>
          <Popper
            open={open}
            anchorEl={anchorEl}
            placement={props.side}
          >
            <Box p={2}>
              {props.user.name}
            </Box>
          </Popper>
        </ClickAwayListener>
      }
    </>
  )
}
