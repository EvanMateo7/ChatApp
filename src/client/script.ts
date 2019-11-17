import {firebaseInit as firebase, firebaseAuth, googleAuthProvider} from "./firebaseClient";

const socket = io.connect('http://localhost:3000');
const joinButton = (document.getElementById('joinButton') as HTMLInputElement);
const sendButton = (document.getElementById('sendButton') as HTMLInputElement);
const googleSignInButton = (document.getElementById('googleSignInButton') as HTMLInputElement);
const postsWall = (document.getElementById('postsWall') as HTMLElement);
const message = (document.getElementById('postMessage') as HTMLInputElement);
let currentRoomID = null;
let myRooms = {};

// Join Room
joinButton.addEventListener('click', (e) => {
    const roomID = (document.getElementById('roomID') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const data = {
        roomID: roomID,
        name: name
    }
    
    if(roomID.trim() == "" || name.trim() == "") {
        alert("Room ID or Name is empty")
        return;
    }
    socket.emit('joinRoom', data);
});

sendButton.addEventListener('click', sendMessage);
googleSignInButton.addEventListener('click', async() => {
    console.log("google");
    
    await firebaseAuth.signInWithPopup(googleAuthProvider).then(function(result) {
        var user = result.user;
        console.log(user.uid);
        
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
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

socket.on('newPost', (post) => {
    updatePostsWall(post);
});

socket.on('error', (error) => {
    console.error(error.message);
})


// Functions
export function sendMessage() {
    if(message.value.trim() == '') {
        alert("message is empty")
        return;
    }
    if(currentRoomID == null) {
        console.error("currentRoomID is null");
        return;
    }
    const newPost = {
        roomID: currentRoomID,
        message: message.value
    }
    socket.emit('post', newPost);
    message.value = '';
}

function updatePostsWall(post) {
    const newPost = document.createElement('div');
    newPost.className = 'post';
    console.log(post);
    if(post.roomID)
        newPost.innerText = post.roomID + ' - ' + post.name + ': ' + post.message;
    else
        newPost.innerText = post.name + ': ' + post.message;

    postsWall.appendChild(newPost);
}

function setRoom(roomID) {
    currentRoomID = roomID;
    console.log('Current Room ID: ' + currentRoomID);
}

function createRoom(roomID) {
    const postNode = document.createElement("div");
    const postText = document.createTextNode(roomID);  
    postNode.appendChild(postText);
    postNode.addEventListener("click", (event) => {
        setRoom(roomID);
    });
    postNode.classList.add("flexColumnCenter")
    document.querySelector('#roomNav').appendChild(postNode);
}