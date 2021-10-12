import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { io } from "socket.io-client";
import { UserContextProvider } from "./components/UserContext";

// Setup
export const socket = io();

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
    console.log('[socket] clients:', data);
});

socket.on('myRooms', (rooms: any) => {
    myRooms = rooms;
    console.log("[socket] my rooms:", rooms);
});

socket.on('error', (error: any) => {
    console.log("[socket] error:", error.message);
})
