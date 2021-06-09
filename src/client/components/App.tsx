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
import React, { useRef, useState, useContext } from "react";
import { useChatRooms } from "../chatService";
import { AppBarUserAvatar } from "./AppBarUserAvatar";
import { ChatRoom } from "./ChatRoom";
import { Login } from "./Login";
import { RoomList } from "./RoomList";
import { UserContext } from "./UserContext";


const baseTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
    secondary: {
      main: "#dc6600",
    },
  },
  props: {
    MuiTextField: {
      variant: "outlined"
    }
  }
});

const theme = createMuiTheme({
  ...baseTheme,
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: "10px"
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: baseTheme.palette.background.paper,
          borderRadius: "8px"
        }
      },
    },
  },
});

export const App = (props: any) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const classes = makeStyles((theme) => ({
    appBar: {
      minHeight: "min-content",
      minWidth: "min-content",
    },
    shifted: {
      width: `calc(100% - ${drawerRef?.current?.offsetWidth}px)`,
      marginLeft: drawerRef?.current?.offsetWidth,
    },
    title: {
      flexGrow: 1,
    },
  }))();

  const { user, logout } = useContext(UserContext);
  const [currentRoom, rooms, setCurrentRoom, joinRoom] = useChatRooms(props.socket, user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleRoomList = () => {
    setIsDrawerOpen((open) => !open);
  }

  return (
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
                : <AppBarUserAvatar user={user!} logout={logout!} />
            }
          </Toolbar>
        </AppBar>
        {
          user && currentRoom &&
          <ChatRoom key={currentRoom} user={user} socket={props.socket} roomID={currentRoom} />
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
  );
}
