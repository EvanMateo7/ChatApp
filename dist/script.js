var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { googleSignIn } from "./firebaseClient.js";
var socket = io.connect('http://localhost:3000');
var joinButton = document.getElementById('joinButton');
var sendButton = document.getElementById('sendButton');
var googleSignInButton = document.getElementById('googleSignInButton');
var postsWall = document.getElementById('postsWall');
var message = document.getElementById('postMessage');
var currentRoomID = null;
var myRooms = {};
// Join Room
joinButton.addEventListener('click', function (e) {
    var roomID = document.getElementById('roomID').value;
    var name = document.getElementById('name').value;
    var data = {
        roomID: roomID,
        name: name
    };
    if (roomID.trim() == "" || name.trim() == "") {
        alert("Room ID or Name is empty");
        return;
    }
    socket.emit('joinRoom', data);
});
sendButton.addEventListener('click', sendMessage);
googleSignInButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("google");
                return [4 /*yield*/, googleSignIn.then(function (result) {
                        var user = result.user;
                        console.log(user);
                    }).catch(function (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        var email = error.email;
                        var credential = error.credential;
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Listeners
socket.on('clients', function (roomID, clients) {
    var data = {
        roomID: roomID,
        clients: clients
    };
    console.log(data);
});
socket.on('myRooms', function (rooms) {
    myRooms = rooms;
    console.log(rooms);
});
socket.on('newRoom', function (newRoomID) {
    createRoom(newRoomID);
    setRoom(newRoomID);
});
socket.on('newPost', function (post) {
    updatePostsWall(post);
});
socket.on('error', function (error) {
    console.error(error.message);
});
// Functions
export function sendMessage() {
    if (message.value.trim() == '') {
        alert("message is empty");
        return;
    }
    if (currentRoomID == null) {
        console.error("currentRoomID is null");
        return;
    }
    var newPost = {
        roomID: currentRoomID,
        message: message.value
    };
    socket.emit('post', newPost);
    message.value = '';
}
function updatePostsWall(post) {
    var newPost = document.createElement('div');
    newPost.className = 'post';
    console.log(post);
    if (post.roomID)
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
    var postNode = document.createElement("div");
    var postText = document.createTextNode(roomID);
    postNode.appendChild(postText);
    postNode.addEventListener("click", function (event) {
        setRoom(roomID);
    });
    postNode.classList.add("flexColumnCenter");
    document.querySelector('#roomNav').appendChild(postNode);
}
//# sourceMappingURL=script.js.map