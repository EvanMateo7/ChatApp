import firebase from "firebase";
import { useEffect, useState } from "react";
import { Socket } from "socket.io";

export const useChatRooms = (socket: Socket, user: firebase.User | null) => {
  const [currentRoom, setCurrentRoom] = useState("");
  const [rooms, setRooms] = useState([] as Array<string>);

  const setRoom = (roomID: string) => {
    if (user == null || !roomID || currentRoom == roomID) return;
    setCurrentRoom(roomID);
    socket.emit("leaveRoom", currentRoom);
    socket.emit("joinRoom", {
      roomID: roomID,
      name: user.displayName
    });
  }

  const joinRoom = (roomID: string) => {
    if (!roomExists(roomID)) {
      setRooms((rooms: string[]) => {
        setRoom(roomID);
        return [...rooms, roomID];
      });
    } 
    else {
      setRoom(roomID);
    }
  }

  const roomExists = (roomID: string) => rooms.indexOf(roomID) !== -1

  return [currentRoom, rooms, setRoom, joinRoom] as const;
}
