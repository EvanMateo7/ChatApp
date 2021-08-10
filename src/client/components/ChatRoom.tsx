import Avatar from "@material-ui/core/Avatar";
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import InputBase from "@material-ui/core/InputBase";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SendIcon from '@material-ui/icons/Send';
import formatRelative from 'date-fns/formatRelative';
import React, { useState } from "react";
import { Socket } from "socket.io";
import { Message, User } from '../../models';
import { useChatRoom } from "../chatService";
import { ChatUserList } from "./ChatUserList";
import { UserInfoPopper } from "./UserInfoPopper";

interface ChatRoomProps { roomID: string, user: User, socket: Socket }
interface ChatMessageProps { user: User, message: Message }

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    display: "flex",
    justifyContent: "space-around",
    height: "100%",
    overflow: "hidden",
  },
  chatRoom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 20,
    flexGrow: 1,
    minWidth: 0,
  },
  chatWall: {
    display: "flex",
    flexDirection: "column-reverse",
    flexGrow: 1,
    flexBasis: 0,
    margin: "10px",
    overflow: "auto",
  },
  chatForm: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
  },
  input: {
    flexGrow: 1,
    padding: 15,
  },
  sendBtn: {
    height: "100%",
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export const ChatRoom = (props: ChatRoomProps) => {

  const classes = useStyles();
  const [users, messages] = useChatRoom(props.roomID);
  const [messageInput, setMessageInput] = useState("");
  const [isUserListOpen, setUserListOpen] = useState(false);

  const toggleUserList = () => {
    setUserListOpen((open) => !open);
  }

  const sendMessage = () => {
    if (messageInput.trim() == "") {
      alert("message is empty")
      return;
    }
    if (!props.roomID) {
      return;
    }
    const newMessage: Message = {
      userID: props.user.id,
      message: messageInput.trim(),
      roomID: props.roomID,
      timestamp: Date.now()
    }

    props.socket.emit('addMessage', newMessage);
    setMessageInput("");
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendMessage();
    return false;
  }

  const handleKeyDown = (e: any) => {
    if (!e.shiftKey && e.keyCode === 13) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMessageChange = (e: any) => {
    setMessageInput(e.target.value);
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.chatRoom}>
        <Box className={classes.chatWall}>
          {
            messages !== null && users
              ? messages.map((m: Message) => <ChatMessage user={users[m.userID]} message={m} />)
              : <LinearProgress />
          }
        </Box>
        <Paper className={classes.chatForm} color="primary" elevation={4} component="form" onSubmit={handleSubmit}>
          <InputBase id="message" className={classes.input} multiline rows={4} placeholder="Message" onKeyDown={handleKeyDown}
            value={messageInput} onChange={handleMessageChange} />
          <Divider orientation="vertical" />
          <Button type="submit" className={classes.sendBtn} color="primary"><SendIcon></SendIcon></Button>
        </Paper>
      </Box>
      <Fab size="small" onClick={toggleUserList} className={classes.fab}>
        <PeopleAltIcon />
      </Fab>
      <ChatUserList users={users} open={isUserListOpen} toggleUserList={toggleUserList} />
    </Box>
  );
}

const ChatMessage = (props: ChatMessageProps) => {

  return (
    <Box key={props.message?.roomID}
      display="flex"
      alignItems="center"
      gridGap="10px"
      margin="10px">

      <Avatar alt={props.user?.name} src={props.user?.photoURL} />
      <Box display="flex"
        flexDirection="column"
        justifyContent="space-between"
        gridGap="5px">
        <div>
          <UserInfoPopper user={props.user} side="right-start">
            <b>{props.user?.name + " "}</b>
          </UserInfoPopper>
          <Typography variant="caption" color="textSecondary">
            {formatRelative(props.message?.timestamp, new Date())}
          </Typography>
        </div>
        <div>{props.message?.message}</div>
      </Box>
    </Box>
  );
}
