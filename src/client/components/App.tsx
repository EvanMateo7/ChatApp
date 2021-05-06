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
import { useChatRoom } from "../chatService";

export const UserContext = React.createContext<firebase.User | null>(null);

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue
  },
});

export const App = (props: any) => {
  const drawerRef = useRef<HTMLDivElement>(null);
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

  const [user, setUser] = useState(null);
  const [currentRoom, rooms, setCurrentRoom, joinRoom] = useChatRoom(props.socket, user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleRoomList = () => {
    setIsDrawerOpen((open) => !open);
  }

  return (
    <UserContext.Provider value={user}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <Box display="flex" flexDirection="column" height="100%" className={isDrawerOpen ? classes.shifted : undefined}>
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

          <ChatRoom key={currentRoom} socket={props.socket} roomID={currentRoom} />
        </Box>

        <Drawer anchor="left" variant="persistent" open={isDrawerOpen}>
          <div ref={drawerRef}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={toggleRoomList}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          </div>
          <RoomList socket={props.socket} currentRoom={currentRoom} rooms={rooms} setCurrentRoom={setCurrentRoom} joinRoom={joinRoom} />
        </Drawer>

      </MuiThemeProvider>
    </UserContext.Provider>
  );
}
