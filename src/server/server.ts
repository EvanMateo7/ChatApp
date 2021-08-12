
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import * as firebaseServer from "./firebaseServer";
import { Message, RoomJoin, User } from "../models";
import * as admin from "firebase-admin";

// Setup
const app = express();
const server = app.listen(3000);
app.use(express.static('dist'));

console.log("Express server starting...");

// SocketIO
const io = new SocketIOServer(server);

io.on('connect', (socket) => {
  console.log(`socket has connected with ID: ${socket.id}`);

  // Singleton room
  let currentRoomID = '';

  // Room
  socket.on('joinRoom', (roomJoin: RoomJoin, callback: Function) => {
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
        callback(true);

        // Emit to self all my rooms
        io.to(socket.id).emit('myRooms', Array.from(socket.rooms));
      })
      .catch(e => {
        callback(false);
      });

    // Get clients
    io.in(roomID).allSockets().then((clients: Set<string>) => {

      // Emit to everyone in room including emitter
      io.to(roomID).emit('clients', roomID, clients);
    });
  });

  socket.on('addMessage', (message: Message) => {
    firebaseServer.addMessage(message.roomID, message);
  });

  socket.on('addUser', (user: admin.auth.UserInfo) => {
    firebaseServer.addUser(user);
  });

  socket.on('editUser', (user: User, ack: Function) => {
    firebaseServer.editUser(user)
      .then(() => ack({}))
      .catch(e => ack(e));
  });
});

console.log("Express server started!");
