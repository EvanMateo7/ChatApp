import React, { useState, useEffect } from "react";
import { ChatRooms } from "./ChatRoom";
import { RoomList } from "./RoomList";

export const App = (props) => {

  const [currentRoom, setCurrentRoom] = useState();
  const [rooms, setRooms] = useState([]);

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
    <React.Fragment>
      <RoomList rooms={rooms} currentRoom={currentRoom} setCurrentRoom={setRoom} />
      <ChatRooms rooms={rooms} socket={props.socket} currentRoom={currentRoom} joinRoom={joinRoom} />
    </React.Fragment>
  );
}
