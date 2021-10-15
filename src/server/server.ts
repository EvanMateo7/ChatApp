
import express from "express";
import * as admin from "firebase-admin";
import { Server as SocketIOServer } from "socket.io";
import { Message, RoomJoin, User } from "../models";
import * as firebaseServer from "./firebaseServer";
import { SocketEvent } from "../socketEvents"

// Setup
const app = express();
const server = app.listen(3000);
app.use(express.static('dist'));

console.log("Express server starting...");

// Create SocketIO server
const socketIOServer = (server: any, firebaseServer: any) => {
  const io = new SocketIOServer(server);
  io.on(SocketEvent.Connect, (socket) => {
    console.log(`socket has connected with ID: ${socket.id}`);

    // Singleton room
    let currentRoomID = '';

    // Room
    socket.on(SocketEvent.JoinRoom, (roomJoin: RoomJoin, ack: Function) => {
      const roomID = roomJoin.roomID;

      // Check if socket is already in room
      if (socket.rooms.has(roomID)) {
        return;
      }

      // Create and join room
      firebaseServer.joinRoom(roomJoin)
        .then(() => {
          socket.join(roomID);
          socket.leave(currentRoomID)
          currentRoomID = roomID;
          ack(true);

          // Emit to self all my rooms
          io.to(socket.id).emit(SocketEvent.UserRooms, Array.from(socket.rooms));
        })
        .catch((e: any) => {
          ack(false);
        });

      // Get clients
      io.in(roomID).allSockets().then((clients: Set<string>) => {

        // Emit to everyone in room including emitter
        io.to(roomID).emit(SocketEvent.RoomClients, roomID, clients);
      });
    });

    socket.on(SocketEvent.AddMessage, (message: Message) => {
      firebaseServer.addMessage(message.roomID, message);
    });

    socket.on(SocketEvent.AddUser, (user: admin.auth.UserInfo) => {
      firebaseServer.addUser(user);
    });

    socket.on(SocketEvent.EditUser, (user: User, ack: Function) => {
      firebaseServer.editUser(user)
        .then(() => ack({}))
        .catch((e: any) => ack(e));
    });
  });

  return io;
}

socketIOServer(server, firebaseServer);
console.log("Express server started!");

export default socketIOServer;
