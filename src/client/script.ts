import * as firebase from "./firebaseClient";
import { Message, RoomJoin } from "../model/models";


const socket = io.connect('http://localhost:3000');
const joinButton = (document.getElementById('joinButton') as HTMLInputElement);
const sendButton = (document.getElementById('sendButton') as HTMLInputElement);
const googleSignInButton = (document.getElementById('googleSignInButton') as HTMLInputElement);
const messageWall = (document.getElementById('messageWall') as HTMLElement);
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
        message: message.value
    }
    
    socket.emit('message', newMessage);
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

    messageWall.appendChild(newMessage);
}

function setRoom(roomID) {
    currentRoomID = roomID;
    console.log('Current Room ID: ' + currentRoomID);
}

function createRoom(roomID) {
    const messageNode = document.createElement("div");
    const messageText = document.createTextNode(roomID);
    messageNode.appendChild(messageText);
    messageNode.addEventListener("click", (event) => {
        setRoom(roomID);
    });
    messageNode.classList.add("flexColumnCenter")
    document.querySelector('#roomNav').appendChild(messageNode);
}