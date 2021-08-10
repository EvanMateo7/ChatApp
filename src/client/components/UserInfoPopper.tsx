import { ClickAwayListener, Popper, Box, Paper, Avatar, Typography, makeStyles } from "@material-ui/core"
import React, { ReactElement, useState } from "react"
import { User } from "../../models";

interface UserInfoPopperProps { children: ReactElement, user: User, side: 'left-start' | 'right-start' }

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    border: "6px solid",
    borderColor: theme.palette.background.paper,
  },
  banner: {
    position: "absolute",
    width: "100%",
    height: theme.spacing(2 + 14 / 2), // Container padding + half of avatar height
    background: theme.palette.background.default,
  },
  clickable: {
    cursor: "pointer",
  },
}));

export const UserInfoPopper = (props: UserInfoPopperProps) => {

  const classes = useStyles();
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
      <span className={classes.clickable} onClick={handleClickOpen}>
        {props.children}
      </span>
      {
        open
        &&
        <ClickAwayListener onClickAway={handleClose}>
          <Popper
            open={open}
            anchorEl={anchorEl}
            placement={props.side}
          >
            <Paper color="primary" elevation={4}>
              <Box className={classes.banner}></Box>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gridGap="5px" width={300} p={2}>
                <Avatar alt={props.user?.name} src={props.user?.photoURL} className={classes.avatar} />
                <Typography variant="body2" noWrap>{props.user?.name}</Typography>
              </Box>
            </Paper>
          </Popper>
        </ClickAwayListener>
      }
    </>
  )
}
