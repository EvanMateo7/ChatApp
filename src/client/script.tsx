import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { io } from "socket.io-client";
import { UserContextProvider } from "./components/UserContext";
import { SocketEvent } from "../socketEvents";

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
socket.on(SocketEvent.RoomClients, (roomID: string, clients: any) => {
  const data = {
    roomID,
    clients
  };
  console.log('[socket] room clients:', data);
});

socket.on(SocketEvent.UserRooms, (rooms: any) => {
  myRooms = rooms;
  console.log("[socket] my rooms:", rooms);
});

socket.on(SocketEvent.Error, (error: any) => {
  console.log("[socket] error:", error.message);
})
