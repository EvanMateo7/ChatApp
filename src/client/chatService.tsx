import firebase from "firebase";
import { useEffect, useState } from "react";
import { firestore } from "./firebaseClient";
import { Socket } from "socket.io";
import { Message, RoomJoin } from "../models";


export const useChatRooms = (socket: Socket, user: firebase.User | null) => {
  const [currentRoom, setCurrentRoom] = useState("");
  const [rooms, setRooms] = useState([] as Array<string>);

  const setRoom = (roomID: string) => {
    if (!user || !roomID || currentRoom == roomID) return;
    setCurrentRoom(roomID);
  }

  const joinRoom = (roomID: string) => {
    if (!user || !roomID || currentRoom == roomID) return;
    if (!roomExists(roomID)) {
      socket.emit("joinRoom", {
        roomID: roomID,
        userID: user.uid
      } as RoomJoin,
      (success: boolean) => {
        success &&
        setRooms((rooms: string[]) => {
          setRoom(roomID)
          return [...rooms, roomID];
        });
      });
    } 
    else {
      setRoom(roomID)
    }
  }

  const roomExists = (roomID: string) => rooms.indexOf(roomID) !== -1

  return [currentRoom, rooms, setRoom, joinRoom] as const;
}


export const useChatRoom = (roomID: string) => {
  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    if (roomID) {
      let unsubscribeMessages = firestore.collection("rooms")
        .doc(roomID)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(3) // TODO: Load more messages on scroll and use Array.slice to update messages
        .onSnapshot(
          (snapshot) => {
            const roomMessages = snapshot.docs.map(doc => doc.data() as Message);
            setMessages(roomMessages);
          },
          (error: firebase.firestore.FirestoreError) => {
            console.error(error);
          }
        );
      
      return unsubscribeMessages;
    }
  }, [roomID]);

  return messages;
}
