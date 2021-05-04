import React, { useState, useEffect } from "react";
import { ChatRooms } from "./ChatRoom";
import { Login } from "./Login";
import { RoomList } from "./RoomList";

export const App = (props) => {

  const [currentRoom, setCurrentRoom] = useState();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState();

  const joinRoom = (roomID) => {
    console.error("rooms", rooms)
    setRooms((rooms) => [...rooms, roomID])
    setCurrentRoom(roomID)
  }

  const setRoom = (newRoomID) => {
    console.error("new room", newRoomID)
    setCurrentRoom(newRoomID)
  }

  useEffect(() => {
    props.socket.on('newRoom', (newRoomID) => {
      joinRoom(newRoomID);
    });

    return () => props.socket.off('newRoom');
  }, [])

  return (
    <div className="main_container">
      <div className="nav_container">
        <Login user={user} setUser={setUser} socket={props.socket} />
      </div>
      <RoomList rooms={rooms} currentRoom={currentRoom} setCurrentRoom={setRoom} />
      <ChatRooms rooms={rooms} socket={props.socket} currentRoom={currentRoom} joinRoom={joinRoom} />
    </div>
  );
}
