import * as firebase from "./firebaseClient";
import { Message, RoomJoin } from "../model/models";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";

// Setup
const socket = io.connect('http://localhost:3000');

// React
ReactDOM.render(
  <App socket={socket} />,
  document.getElementById("root")
);

const joinButton = (document.getElementById('joinButton') as HTMLInputElement);
const googleSignInButton = (document.getElementById('googleSignInButton') as HTMLInputElement);
let myRooms = {};

googleSignInButton.addEventListener('click', () => {
    firebase.googleLogin().then( user => {user ? socket.emit('login', user) : null} );
});

// Join Room
joinButton.addEventListener('click', (e) => {
    const roomID = (document.getElementById('roomID') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const roomJoin: RoomJoin = {
        roomID: roomID,
        name: name
    }

    if (roomID.trim() == "" || name.trim() == "") {
        alert("Room ID or Name is empty")
        return;
    }
    socket.emit('joinRoom', roomJoin);
});

// Listeners
socket.on('clients', (roomID, clients) => {
    const data = {
        roomID,
        clients
    };
    console.log(data);
});

socket.on('myRooms', (rooms) => {
    myRooms = rooms;
    console.log(rooms);
});

socket.on('error', (error) => {
    console.error(error.message);
})
