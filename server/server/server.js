"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var socketio = require("socket.io");
var firebase = require("./firebaseServer");
var app = express();
var server = app.listen(3000);
app.use(express.static('dist'));
console.log("Express server starting...");
// SocketIO
var io = socketio(server);
io.on('connect', function (socket) {
    console.log('Socket has connected with ID: ' + socket.id);
    // Room
    socket.on('joinRoom', function (roomJoin) {
        var roomID = roomJoin.roomID;
        // Create room
        firebase.joinRoom(roomJoin)
            .catch(function (e) { return console.error(e + " - Source server.ts"); });
        // Check if socket is already in room
        if (Object.keys(io.sockets.adapter.sids[socket.id]).includes(roomID)) {
            return;
        }
        // Join room
        socket.join(roomID);
        // Get clients
        io.in(roomID).clients(function (error, clients) {
            // Emit to everyone in room including emitter
            io.to(roomID).emit('clients', roomID, clients);
            // Emit to self all my rooms
            io.to(socket.id).emit('myRooms', io.sockets.adapter.sids[socket.id]);
            // Emit to self current room
            io.to(socket.id).emit('newRoom', roomID);
        });
        // Listeners in room
        socket.in(roomID).on('message', function (message) {
            message.sender = roomJoin.name;
            firebase.storeMessage(roomID, message)
                .then(function () { return io.in(roomID).emit('newMessage', message); })
                .catch(function (e) { return console.error(e + " - Source: server.ts"); });
        });
    });
    socket.on('login', function (user) {
        firebase.addUser(user).catch(function (e) { return console.error(e + " - Source: server.ts"); });
    });
    // Disconnect
    socket.on('disconnect', function () {
        socket.removeAllListeners();
    });
});
console.log("Express server started!");
//# sourceMappingURL=server.js.map