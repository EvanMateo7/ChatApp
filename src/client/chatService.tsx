import firebase from "firebase";
import { useEffect, useState } from "react";
import { firestore } from "./firebaseClient";
import { Socket } from "socket.io";
import { Message, RoomJoin, User } from "../models";
import { SocketEvent } from "../socketEvents";


export const useChatRooms = (socket: Socket, user: User | null) => {
  const [currentRoom, setCurrentRoom] = useState("");
  const [rooms, setRooms] = useState([] as Array<string>);

  useEffect(() => {
    if (user?.id) {
      (async () => {
        await firestore.collection("rooms")
          .where('users', 'array-contains', user.id)
          .get()
          .then((snapshot) => {
            const roomIDs = snapshot.docs.map(doc => doc.id);
            setRooms((rooms) => addNewRooms(rooms, roomIDs));
          })
      })();
    }
  }, [user]);

  const setRoom = (roomID: string) => {
    if (!user || !roomID || currentRoom == roomID) return;
    setCurrentRoom(roomID);
  }

  const joinRoom = (roomID: string) => {
    if (!user || !roomID || currentRoom == roomID) return;
    if (!roomExists(roomID)) {
      socket.emit(SocketEvent.JoinRoom, {
        roomID: roomID,
        userID: user.id
      } as RoomJoin,
        (success: boolean) => {
          success &&
            setRooms((rooms) => {
              setRoom(roomID);
              return addNewRooms(rooms, [roomID]);
            });
        });
    }
    else {
      setRoom(roomID)
    }
  }

  const roomExists = (roomID: string) => rooms.indexOf(roomID) !== -1

  const addNewRooms = (existingRooms: string[], roomIDs: string[]) => Array.from(new Set([...existingRooms, ...roomIDs]));

  return [currentRoom, rooms, setRoom, joinRoom] as const;
}


export const useChatRoom = (roomID: string) => {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [users, setUsers] = useState<{ [key: string]: User } | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (roomID) {
      (async () => {
        // Get some latest messages first
        await firestore.collection("rooms")
          .doc(roomID)
          .collection("messages")
          .orderBy("timestamp", "desc")
          .limit(5)
          .get()
          .then((snapshot) => {
            const roomMessages = snapshot.docs.map(doc => doc.data() as Message);
            setMessages(roomMessages);
          })
          .catch((error) => console.error(error))
          .finally(() => {
            setInitialLoadDone(true);
          });
      })();
    }
  }, [roomID]);

  useEffect(() => {
    if (roomID && initialLoadDone) {

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

      // Get and listen to room users
      let unsubscribeUsers = firestore.collection("rooms")
        .doc(roomID)
        .onSnapshot(
          (snapshot) => {
            const users = snapshot.data()?.users as Array<Array<any>>;

            if (users) {
              const usersSublists = users.reduce((accumulator, currentValue, index, array) => {
                const lastSublist = accumulator[accumulator.length - 1];
                if (Array.isArray(lastSublist) && lastSublist.length < 10) {
                  lastSublist.push(currentValue);
                }
                else {
                  accumulator.push([currentValue]);
                }
                return accumulator;
              }, []);

              const userSnapshotsPromises = usersSublists.map(usersSublist => {
                return firestore.collection("users")
                  .where("id", "in", usersSublist)
                  .get();
              });

              Promise.all(userSnapshotsPromises).then((userSnapshots) => {
                const allUsers = {} as { [key: string]: User };

                userSnapshots.map(snapshot => {
                  snapshot.docs.map(doc => {
                    const data = doc.data() as User;
                    allUsers[data.id] = data;
                  })
                })

                setUsers(allUsers);
              });
            }
          },
          (error: firebase.firestore.FirestoreError) => {
            console.error(error);
          }
        );

      return () => {
        unsubscribeMessages();
        unsubscribeUsers();
      }

    }
  }, [roomID, initialLoadDone]);

  return [users, messages] as const;
}
