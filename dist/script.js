
const socket = io.connect('http://localhost:3000');
const joinButton = document.getElementById('joinButton');
const postsWall = document.getElementById('postsWall');
const postMessage = document.getElementById('postMessage');

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
socket.on('clients', (data) => {
    console.log(data);
    socket.emit('myRooms');
});

socket.on('myRooms', (rooms) => {
    console.log(rooms)
});

socket.on('post', (post) => {
    updatePostsWall(post);
});


// Functions
function sendMessage() {
    if(postMessage.value.trim() == '') {
        console.error('message is empty');
        return;
    }
    
    const newPost = {
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