
import * as express from "express";
import * as socketio from "socket.io";
import * as firebase from "./firebaseServer";
import { Message, RoomJoin } from "../model/models";

const app = express();
const server = app.listen(3000);
app.use(express.static('dist'));

console.log("Express server starting...");

// SocketIO
const io = socketio(server);

io.on('connect', (socket) => {
    console.log('Socket has connected with ID: ' + socket.id);

    // Room
    socket.on('joinRoom', (roomJoin: RoomJoin) => {
        const roomID = roomJoin.roomID;
        
        // Create room
        firebase.joinRoom(roomJoin)
            .catch( e => console.error(`${e} - Source server.ts`) );
        // Check if socket is already in room
        if (Object.keys(io.sockets.adapter.sids[socket.id]).includes(roomID)) {
            return;
        }

        // Join room
        socket.join(roomID);

        // Get clients
        io.in(roomID).clients((error, clients) => {

            // Emit to everyone in room including emitter
            io.to(roomID).emit('clients', roomID, clients);      
            
            // Emit to self all my rooms
            io.to(socket.id).emit('myRooms', io.sockets.adapter.sids[socket.id]);

            // Emit to self current room
            io.to(socket.id).emit('newRoom', roomID);
        });

        // Listeners in room
        socket.in(roomID).on('message', (message: Message) => {
            message.sender = roomJoin.name;
            
            firebase.storeMessage(roomID, message)
                .then( () => io.in(roomID).emit('newMessage', message))
                .catch( e => console.error(`${e} - Source: server.ts`));
        });
    });

        

    socket.on('login', (user) => {
        firebase.addUser(user).catch( e => console.error(`${e} - Source: server.ts`));
    });

    // Disconnect
    socket.on('disconnect', () => {
        socket.removeAllListeners();
    });
});



console.log("Express server started!");



