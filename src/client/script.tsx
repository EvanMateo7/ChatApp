import * as firebase from "./firebaseClient";
import { Message, RoomJoin } from "../model/models";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ChatRooms, ChatRoom } from "./components/ChatRoom";
import { RoomList } from "./components/RoomList";


const socket = io.connect('http://localhost:3000');
const joinButton = (document.getElementById('joinButton') as HTMLInputElement);
const sendButton = (document.getElementById('sendButton') as HTMLInputElement);
const googleSignInButton = (document.getElementById('googleSignInButton') as HTMLInputElement);
const message = (document.getElementById('message') as HTMLInputElement);
let currentRoomID = null;
let myRooms = {};

sendButton.addEventListener('click', sendMessage);

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

socket.on('newRoom', (newRoomID) => {
    createRoom(newRoomID);
    setRoom(newRoomID);
});

socket.on('newMessage', (message) => {
    updateMessageWall(message);
    console.log("new message")
});

socket.on('error', (error) => {
    console.error(error.message);
})


// Functions
function sendMessage() {
    if (message.value.trim() == '') {
        alert("message is empty")
        return;
    }
    if (currentRoomID == null) {
        console.error("Error: currentRoomID is null");
        return;
    }
    const newMessage: Message = {
        sender: null,
        message: message.value,
        roomID: currentRoomID
    }
    
    socket.emit('message', newMessage);
    console.log('sent new message')
    message.value = '';
}

function updateMessageWall(message: Message) {
    const newMessage = document.createElement('div');
    newMessage.className = 'message';
    console.log(message);
    if (message.roomID)
        newMessage.innerText = message.roomID + ' - ' + message.sender + ': ' + message.message;
    else
        newMessage.innerText = message.sender + ': ' + message.message;

    const messageWall = (document.querySelector(`.messageWall[data-roomID = "${message.roomID}"]`) as HTMLElement);
    messageWall.appendChild(newMessage);
}

function setRoom(roomID) {
    currentRoomID = roomID;
    updateRoomListUI();
    toggleRoomWall();
    console.log('Current Room ID: ' + currentRoomID);
}

function createRoom(roomID) {
    const roomDiv = document.createElement("div");
    const newMessageWall = document.createElement("div");

    // Room List
    const messageText = document.createTextNode(roomID);
    roomDiv.appendChild(messageText);
    roomDiv.setAttribute('data-roomID', roomID);
    roomDiv.addEventListener("click", (event) => {
        setRoom(roomID);
    });
    roomDiv.classList.add("flexColumnCenter")
    document.querySelector('#roomNav').appendChild(roomDiv);

    // Room Message Wall
    newMessageWall.classList.add('messageWall');
    newMessageWall.setAttribute('data-roomID', roomID);
    document.querySelector('#messageWallContainer').appendChild(newMessageWall);
}

function updateRoomListUI() {
    const roomDivs = document.querySelectorAll(`#roomNav div[data-roomID]`);
    roomDivs.forEach( div => {
        div.removeAttribute('id')
        if(div.getAttribute('data-roomID') == currentRoomID)
            div.setAttribute('id', 'selectedRoom');

    });
}

function toggleRoomWall() {
    const messageWalls = document.querySelectorAll('.messageWall');
    messageWalls.forEach( wall => {
        wall.setAttribute('style', 'display:none');
        if(wall.getAttribute('data-roomID') == currentRoomID)
        wall.setAttribute('style', 'display:block');
    });
}