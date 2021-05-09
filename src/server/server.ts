
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import * as firebase from "./firebaseServer";
import { Message, RoomJoin } from "../models";

// Setup
const app = express();
const server = app.listen(3000);
app.use(express.static('dist'));

console.log("Express server starting...");

// SocketIO
const io = new SocketIOServer(server);

io.on('connect', (socket) => {
    console.log('Socket has connected with ID: ' + socket.id);

    // Room
    socket.on('joinRoom', (roomJoin: RoomJoin) => {
        const roomID = roomJoin.roomID;
        
        // Check if socket is already in room
        if (socket.rooms.has(roomID)) {
            return;
        }
        
        // Create and join room
        firebase.joinRoom(roomJoin)
          .then(() => {
            socket.join(roomID);

            // Emit to self all my rooms
            io.to(socket.id).emit('myRooms', Array.from(socket.rooms));
          })
          .catch( e => console.error(`${e} - source server.ts - on joinRoom`) );
        
        // Get clients
        io.in(roomID).allSockets().then((clients: Set<string>) => {

            // Emit to everyone in room including emitter
            io.to(roomID).emit('clients', roomID, clients);

            // Emit to self current room
            io.to(socket.id).emit('newRoom', roomID);
        });
    });

    socket.on('message', (message: Message) => {
      firebase.addMessage(message.roomID, message)
          .then(() => io.in(message.roomID).emit('receiveMessage', message))
          .catch(e => console.error(`${e} - source: server.ts - on message`));    
    });

    socket.on('leaveRoom', async (roomID: string) => {
      await socket.leave(roomID)
      console.error("LEFT ROOM ", roomID);
    });

    socket.on('login', (user) => {
        firebase.addUser(user).catch( e => console.error(`${e} - source: server.ts - on login`));
    });

    socket.on('disconnect', () => {
        console.error("DISCONNED")
        socket.removeAllListeners();
    });
});



console.log("Express server started!");



