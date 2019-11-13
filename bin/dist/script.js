const socket = io.connect('http://localhost:3000');
const joinButton = document.getElementById('joinButton');
const postsWall = document.getElementById('postsWall');
const postMessage = document.getElementById('postMessage');
let currentRoomID = null;
let myRooms = {};

// Join Room
joinButton.addEventListener('click', (e) => {
    const roomID = document.getElementById('roomID').value;
    const name = document.getElementById('name').value;
    const data = {
        roomID: roomID,
        name: name
    }
    
    if(roomID.trim() == "" || name.trim() == "") {
        console.error("Room ID or Name is empty");
        return;
    }
    socket.emit('joinRoom', data);
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
function sendMessage() {
    if(postMessage.value.trim() == '') {
        console.error('message is empty');
        return;
    }
    if(currentRoomID == null) {
        console.error("currentRoomID is null");
        return;
    }
    const newPost = {
        roomID: currentRoomID,
        message: postMessage.value
    }
    socket.emit('post', newPost);
    postMessage.value = '';
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









socket.on('mouse', (mouseCoord) => {
    fill(255, 255, 0);
    noStroke();
    ellipse(mouseCoord.x, mouseCoord.y, 10, 10);
})

function setup() {
    createCanvas(200,200).parent('canvas');
    background(100);
}

function draw() {
    
}

function mouseDragged() {
    fill(255);
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);

    const data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('mouse', data);
}