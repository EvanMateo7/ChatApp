import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ImageIcon from '@material-ui/icons/Image';
import React, { useContext, useState } from "react";
import { Socket } from "socket.io";
import { UserContext } from "./UserContext";

export interface RoomListProps {
  socket: Socket,
  currentRoom: string,
  rooms: string[],
  setCurrentRoom: Function,
  joinRoom: Function,
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: 15,
  },
  roomForm: {
    paddingTop: 15,
    paddingBottom: 15,
  }
}));

export const RoomList = (props: RoomListProps) => {

  const classes = useStyles();
  const user = useContext(UserContext);
  const [roomIDInput, setRoomIDInput] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (user == null || roomIDInput.trim() == "") {
      alert("Room ID is empty")
      return;
    }

    props.joinRoom(roomIDInput.trim());
    setRoomIDInput("");
    return false;
  }

  const handleRoomIDChange = (e: any) => {
    setRoomIDInput(e.target.value);
  }

  return (
    <Box className={classes.root}>
      <form className={classes.roomForm} onSubmit={handleSubmit} noValidate>
        <FormControl>
          <TextField id="roomID" margin="normal" label="Room ID" InputLabelProps={{ shrink: true, }}
            value={roomIDInput} onChange={handleRoomIDChange} />
          <Button type="submit" variant="contained" color="primary">Join</Button>
        </FormControl>
      </form>
      <Divider variant="middle" />
      {
        props.rooms && props.rooms.length > 0 &&
        <List
          component="nav"
          subheader={
            <ListSubheader>
              Rooms
            </ListSubheader>
          }
        >
          {
            props.rooms.map(roomID =>
              <>
                <ListItem button onClick={() => props.setCurrentRoom(roomID)} selected={roomID === props.currentRoom}>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={roomID} />
                </ListItem>
              </>
            )
          }
        </List>
      }
    </Box>
  );
}
