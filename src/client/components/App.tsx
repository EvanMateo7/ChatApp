import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import firebase from "firebase";
import React, { useState, useEffect, useRef } from "react";
import { ChatRoom } from "./ChatRoom";
import { Login } from "./Login";
import { RoomList } from "./RoomList";
import Drawer from "@material-ui/core/Drawer";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import blue from '@material-ui/core/colors/blue';
import Box from "@material-ui/core/Box";

export const UserContext = React.createContext(null);

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue
  },
});

export const App = (props) => {
  const drawerRef = useRef(null);
  const classes = makeStyles((theme) => ({
    appBar: {
      minHeight: 70,
    },
    shifted: {
      width: `calc(100% - ${drawerRef?.current?.offsetWidth}px)`,
      marginLeft: drawerRef?.current?.offsetWidth,
    },
    title: {
      flexGrow: 1,
    },
  }))();

  const [currentRoom, setCurrentRoom] = useState();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState();
  const [roomListIsOpen, setRoomListIsOpen] = useState(false);

  const toggleRoomList = () => {
    setRoomListIsOpen((open) => !open);
  }

  const joinRoom = (roomID) => {
    setRooms((rooms) => [...rooms, roomID])
    setCurrentRoom(roomID)
  }

  const setRoom = (newRoomID) => {
    setCurrentRoom(newRoomID)
  }

  useEffect(() => {
    props.socket.on('newRoom', (newRoomID) => {
      joinRoom(newRoomID);
    });

    return () => props.socket.off('newRoom');
  }, [])

  return (
    <UserContext.Provider value={user}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <Box display="flex" flexDirection="column" height="100%" className={roomListIsOpen ? classes.shifted : null}>
          <AppBar
            position="static"
            className={classes.appBar}>
            <Toolbar>
              <Button color="inherit" onClick={toggleRoomList}>Rooms</Button>
              <Typography variant="h6" align="center" className={classes.title}>
                ChatApp
              </Typography>
              <Login user={user} setUser={setUser} socket={props.socket} />
            </Toolbar>
          </AppBar>

          <ChatRoom key={currentRoom} socket={props.socket} roomID={currentRoom} currentRoom={currentRoom} joinRoom={joinRoom} />
        </Box>

        <Drawer anchor="left" variant="persistent" open={roomListIsOpen}>
          <div ref={drawerRef}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={toggleRoomList}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          </div>
          <RoomList socket={props.socket} rooms={rooms} currentRoom={currentRoom} setCurrentRoom={setRoom} />
        </Drawer>

      </MuiThemeProvider>
    </UserContext.Provider>
  );
}
