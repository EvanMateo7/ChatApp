import firebase from "firebase";
import { useEffect, useState } from "react";
import { Socket } from "socket.io";

export const useChatRoom = (socket: Socket, user: firebase.User | null) => {
  const [currentRoom, setCurrentRoom] = useState("");
  const [rooms, setRooms] = useState([] as Array<string>);

  const setRoom = (roomID: string) => {
    console.error(rooms, roomID, user == null, !roomID, currentRoom == roomID)
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
  }

  const roomExists = (roomID: string) => rooms.indexOf(roomID) !== -1

  return [currentRoom, rooms, setRoom, joinRoom] as const;
}
