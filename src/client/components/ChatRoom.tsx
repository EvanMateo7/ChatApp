import React, { useState } from "react";
import Box from '@material-ui/core/Box';
import SendIcon from '@material-ui/icons/Send';
import { Message, User } from '../../models'
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Socket } from "socket.io";
import { useChatRoom } from "../chatService";
import LinearProgress from "@material-ui/core/LinearProgress";
import Avatar from "@material-ui/core/Avatar";
import formatRelative from 'date-fns/formatRelative'
import Typography from "@material-ui/core/Typography";

interface ChatRoomProps { roomID: string, user: User, socket: Socket }
interface ChatMessageProps { user: User, message: Message }

const useStyles = makeStyles((theme) => ({
  chatRoom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 20,
    height: "100%",
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
  },
  input: {
    flexGrow: 1,
    padding: 15,
  },
  sendBtn: {
    height: "100%",
  },
}));

export const ChatRoom = (props: ChatRoomProps) => {

  const classes = useStyles();
  const [users, messages] = useChatRoom(props.roomID);
  const [messageInput, setMessageInput] = useState("");

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

    props.socket.emit('message', newMessage);
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
          <b>{props.user?.name + " "}</b>
          <Typography variant="caption" color="textSecondary">
            {formatRelative(props.message?.timestamp, new Date())}
          </Typography>
        </div>
        <div>{props.message?.message}</div>
      </Box>
    </Box>
  );
}
