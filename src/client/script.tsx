import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { io } from "socket.io-client";
import { UserContextProvider } from "./components/UserContext";

// Setup
const socket = io();

// React
ReactDOM.render(
  <UserContextProvider>
    <App socket={socket} />
  </UserContextProvider>,
  document.getElementById("root")
);

let myRooms = {};

// Listeners
socket.on('clients', (roomID: string, clients: any) => {
    const data = {
        roomID,
        clients
    };
    console.log(data);
});

socket.on('myRooms', (rooms: any) => {
    myRooms = rooms;
    console.log("YOUR ROOMS", rooms);
});

socket.on('error', (error: any) => {
    console.log(error.message);
})
