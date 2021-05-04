import firebase from "firebase";
import React, { useState, useEffect } from "react";
import { ChatRoom } from "./ChatRoom";
import { Login } from "./Login";
import { RoomList } from "./RoomList";

export const UserContext: React.Context<firebase.User> = React.createContext(null);

export const App = (props) => {

  const [currentRoom, setCurrentRoom] = useState();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState();

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
      <div className="main_container">
      {
        user
        ? (
          <React.Fragment>
            <div className="nav_container">
              <Login user={user} setUser={setUser} socket={props.socket} />
            </div>
            <RoomList socket={props.socket} rooms={rooms} currentRoom={currentRoom} setCurrentRoom={setRoom} />
            <ChatRoom socket={props.socket} roomID={currentRoom} currentRoom={currentRoom} joinRoom={joinRoom} />
          </React.Fragment>
        )
        : <Login user={user} setUser={setUser} socket={props.socket} />
      }
      </div>
    </UserContext.Provider>
  );
}
