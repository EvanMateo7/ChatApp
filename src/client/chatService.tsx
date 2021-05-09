import firebase from "firebase";
import { useState } from "react";
import { Socket } from "socket.io";

export const useChatRoom = (socket: Socket, user: firebase.User | null) => {
  const [currentRoom, setCurrentRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  const setRoom = (roomID: string) => {
    if (user == null) return;
    setCurrentRoom(roomID);
    if (roomID !== currentRoom) {
      socket.emit("leaveRoom", currentRoom);
      socket.emit("joinRoom", {
        roomID: roomID,
        name: user.displayName
      });
    }
  }

  const joinRoom = (roomID: string) => {
    setRooms((rooms) => [...rooms, roomID] as any);
    setRoom(roomID);
  }

  return [currentRoom, rooms, setRoom, joinRoom] as const;
}
