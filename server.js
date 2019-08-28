
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = app.listen(3000);
app.use(express.static('dist'));

// Express
app.use('/room/:id', function (req, res, next) {
    console.log(req.params.id);
    return res.redirect('/room.html');
});

// SocketIO
const io = socketio(server);

io.on('connect', (socket) => {
    console.log('Socket has connected with ID: ' + socket.id);

    // Room
    socket.on('joinRoom', (data) => {

        // Join
        socket.join(data.roomID);

        // Get clients
        io.in(data.roomID).clients((error, clients) => {
            if (error) throw error;
            io.to(data.roomID).emit('clients', clients);
            socket.emit('myRooms', io.sockets.adapter.sids[socket.id] );
          });

        // Listen
        socket.in(data.roomID).on('post', (post) => {
            post.roomID = data.roomID;
            post.name = data.name;
            console.log(post);
            io.in(data.roomID).emit('post', post);
        })
    });


    // Canvas
    socket.on('mouse', (mouseCoord) => {
        socket.broadcast.emit('mouse', mouseCoord);
    });

    // Messages
    // socket.on('post', (post) => {
    //     io.emit('post', post);
    // })

    // Disconnect
    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnect', 'user disconnected');
    });
});



