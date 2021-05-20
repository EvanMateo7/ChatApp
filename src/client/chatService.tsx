import firebase from "firebase";
import { useEffect, useState } from "react";
import { firestore } from "./firebaseClient";
import { Socket } from "socket.io";
import { Message, RoomJoin, User } from "../models";


export const useChatRooms = (socket: Socket, user: User | null) => {
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
        userID: user.id
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

      // Get some latest messages first
      firestore.collection("rooms")
        .doc(roomID)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(5)
        .get()
        .then((snapshot) => {
          const roomMessages = snapshot.docs.map(doc => doc.data() as Message);
          setMessages(roomMessages);
        })
        .catch((error) => console.error(error));

      // Listen to new messages
      let ignoredFirstRead = false;
      let unsubscribeMessages = firestore.collection("rooms")
        .doc(roomID)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(1)
        .onSnapshot(
          (snapshot) => {
            if (ignoredFirstRead) {
              const roomMessages = snapshot.docs.map(doc => doc.data() as Message);
              setMessages((messages) => {
                return (messages
                ? [...roomMessages, ...messages]
                : roomMessages)
              });
            }
            else {
              ignoredFirstRead = true;
            }
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
