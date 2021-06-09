import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import React from "react";
import { User } from "../../models";
import { UserAvatar } from "./UserAvatar";

export interface ChatUserListProps { users: { [key: string]: User } | null }

export const ChatUserList = (props: ChatUserListProps) => {

  return (
    <Box display="flex" flexDirection="column" height="100%" padding="15px" >
      <List
        component="nav"
        subheader={
          <ListSubheader disableSticky>
          Room Users
          </ListSubheader>
        }>
        {props.users && Object.values(props.users).map(user =>
          <>
            <ListItem button>
              <UserAvatar user={user} />
            </ListItem>
          </>
        )}
      </List>
    </Box >
  );
}
