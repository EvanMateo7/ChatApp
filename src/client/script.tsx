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

let myRooms = {};

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
