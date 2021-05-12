
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import * as firebaseServer from "./firebaseServer";
import { Message, RoomJoin } from "../models";
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
        console.log(`joinRoom - ${JSON.stringify(roomJoin)}`);
        callback(true);

        // Emit to self all my rooms
        io.to(socket.id).emit('myRooms', Array.from(socket.rooms));
      })
      .catch(e => {
        console.error(`${e} - source server.ts - on joinRoom`);
        callback(false);
      });

    // Get clients
    io.in(roomID).allSockets().then((clients: Set<string>) => {

      // Emit to everyone in room including emitter
      io.to(roomID).emit('clients', roomID, clients);

      // Emit to self current room
      io.to(socket.id).emit('newRoom', roomID);
    });
  });

  socket.on('message', (message: Message) => {
    firebaseServer.addMessage(message.roomID, message)
      .then(() => {
        io.in(message.roomID).emit('receiveMessage', message)
        console.log(`message - ${JSON.stringify(message)}`);
      })
      .catch(e => console.error(`${e} - source: server.ts - on message`));
  });

  socket.on('login', (user: admin.auth.UserInfo) => {
    firebaseServer.addUser(user)
      .then(() => console.log(`login - user: ${user.displayName}`))
      .catch(e => console.error(`${e} - source: server.ts - on login`));
  });
});

console.log("Express server started!");
