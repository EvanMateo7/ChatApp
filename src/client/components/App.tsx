import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import blue from '@material-ui/core/colors/blue';
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme, makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import firebase from "firebase";
import React, { useRef, useState } from "react";
import { useChatRooms } from "../chatService";
import { useCurrentUser } from "../authService";
import { ChatRoom } from "./ChatRoom";
import { Login } from "./Login";
import { RoomList } from "./RoomList";
import { User } from "./User";


export const UserContext = React.createContext<firebase.User | null>(null);

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: {
      main: "#dc6600",
    },
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

  const [user, logout] = useCurrentUser();
  const [currentRoom, rooms, setCurrentRoom, joinRoom] = useChatRooms(props.socket, user);
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
              {
                !user
                ? <Login socket={props.socket} />
                : <User user={user} logout={logout} />
              }
            </Toolbar>
          </AppBar>
          {
            currentRoom &&
            <ChatRoom key={currentRoom} socket={props.socket} roomID={currentRoom} />
          }
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
