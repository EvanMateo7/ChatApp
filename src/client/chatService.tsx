import firebase from "firebase";
import { useEffect, useState } from "react";
import { firestore } from "./firebaseClient";
import { Socket } from "socket.io";
import { Message } from "../models";


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


export const useChatRoom = (roomID: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (roomID) {
      const unsubscribe = firestore.collection("rooms")
        .doc(roomID)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(3)
        .onSnapshot((snapshot) => {
          const roomMessages = snapshot.docs.map(doc => doc.data() as Message);
          setMessages(roomMessages);
        });
      
      return unsubscribe;
    }
  }, [roomID]);

  return messages;
}
