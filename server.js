
const express = require('express');
const socketio = require('socket.io');
const firebase = require('./firebaseServer');

const app = express();
const server = app.listen(3000);
app.use(express.static('dist'));

// SocketIO
const io = socketio(server);

io.on('connect', (socket) => {
    console.log('Socket has connected with ID: ' + socket.id);

    // Room
    socket.on('joinRoom', joinRoom);

        function joinRoom(data) {

            // Check if socket is already in room
            if (Object.keys(io.sockets.adapter.sids[socket.id]).includes(data.roomID)) {
                return;
            }

            // Join room
            socket.join(data.roomID);

            // Get clients
            io.in(data.roomID).clients((error, clients) => {

                // Emit to everyone in room including emitter
                io.to(data.roomID).emit('clients', data.roomID, clients);      
                
                // Emit to self all my rooms
                io.to(socket.id).emit('myRooms', io.sockets.adapter.sids[socket.id]);

                // Emit to self current room
                io.to(socket.id).emit('newRoom', data.roomID);
            });

            // Listeners
            socket.in(data.roomID).on('post', (post) => {
                if(data.roomID != post.roomID) return;

                post.roomID = data.roomID;
                post.name = data.name;
                console.log(post);
                io.in(data.roomID).emit('newPost', post);
            });
        }

    // Canvas
    socket.on('mouse', (mouseCoord) => {
        socket.broadcast.emit('mouse', mouseCoord);
    });

    // Disconnect
    socket.on('disconnect', () => {
        socket.removeAllListeners();
    });
});



