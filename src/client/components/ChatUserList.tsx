import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from "react";
import { User } from "../../models";
import { UserAvatar } from "./UserAvatar";
import { UserInfoPopper } from "./UserInfoPopper";

export interface ChatUserListProps { users: { [key: string]: User } | null, open: boolean, toggleUserList: () => void }

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
    minWidth: "min-content",
  },
}));

export const ChatUserList = (props: ChatUserListProps) => {
  const classes = useStyles();

  return (
    <Slide direction="left" timeout={100} in={props.open} mountOnEnter unmountOnExit>
      <Paper className={classes.root}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={props.toggleUserList}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <List
          component="nav"
          subheader={
            <ListSubheader disableSticky>
              Room Users
              </ListSubheader>
          }>
          {props.users && Object.values(props.users).map(user =>
            <>
              <UserInfoPopper user={user} side="left-start">
                <ListItem button>
                    <UserAvatar user={user} />
                </ListItem>
              </UserInfoPopper>
            </>
          )}
        </List>
      </Paper>
    </Slide>
  );
}
