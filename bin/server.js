"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var socketio = require("socket.io");
var app = express();
var server = app.listen(3000);
app.use(express.static(__dirname + '/dist'));
console.log("Express server starting...");
// SocketIO
var io = socketio(server);
io.on('connect', function (socket) {
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
        io.in(data.roomID).clients(function (error, clients) {
            // Emit to everyone in room including emitter
            io.to(data.roomID).emit('clients', data.roomID, clients);
            // Emit to self all my rooms
            io.to(socket.id).emit('myRooms', io.sockets.adapter.sids[socket.id]);
            // Emit to self current room
            io.to(socket.id).emit('newRoom', data.roomID);
        });
        // Listeners in room
        socket.in(data.roomID).on('post', function (post) {
            //if(data.roomID != post.roomID) return;
            post.roomID = data.roomID;
            post.name = data.name;
            console.log(post);
            io.in(data.roomID).emit('newPost', post);
        });
    }
    // Disconnect
    socket.on('disconnect', function () {
        socket.removeAllListeners();
    });
});
console.log("Express server started!");
//# sourceMappingURL=server.js.map