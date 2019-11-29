"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
admin.initializeApp({
    // GOOGLE_APPLICATION_CREDENTIALS environment variable
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://chatapp-58582.firebaseio.com'
});
;
var db = admin.firestore();
function addUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var usersRef, userExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usersRef = db.collection('users');
                    return [4 /*yield*/, usersRef.doc(user.uid).get().then(function (user) { return user.exists; })];
                case 1:
                    userExists = _a.sent();
                    if (!userExists) {
                        usersRef.doc(user.uid).set({
                            id: user.uid,
                            name: user.displayName
                        })
                            .then(function () { return console.log("New user created with UID " + user.uid); })
                            .catch(function (e) { return console.error(e + " - Source: sfirebaseServer.ts"); });
                        ;
                    }
                    else {
                        console.log("User " + user.uid + " already exists.");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.addUser = addUser;
;
function joinRoom(roomjoin) {
    return __awaiter(this, void 0, void 0, function () {
        var roomRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomRef = db.collection("rooms");
                    return [4 /*yield*/, roomRef.doc(roomjoin.roomID).set({ users: admin.firestore.FieldValue.arrayUnion(roomjoin.name) }, { merge: true })
                            .then(function () { return console.log("Room created with ID: " + roomjoin.roomID); })
                            .catch(function (e) { return console.error(e + " - Source ssfirebaseServer.ts"); })];
                case 1:
                    _a.sent();
                    roomRef.doc(roomjoin.roomID).collection("messages").doc("0").create({})
                        .catch(function (e) { return console.error(e + " - Source ssfirebaseServer.ts"); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.joinRoom = joinRoom;
function storeMessage(roomID, message) {
    return __awaiter(this, void 0, void 0, function () {
        var roomRef, roomExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomRef = db.collection("rooms");
                    return [4 /*yield*/, roomRef.doc(roomID).get().then(function (room) { return room.exists; })];
                case 1:
                    roomExists = _a.sent();
                    if (roomExists) {
                        roomRef.doc(roomID).collection("messages").doc().create(message)
                            .catch(function (e) { return console.error(e + " - Source sssfirebaseServer.ts"); });
                        console.log("Message saved: " + message);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.storeMessage = storeMessage;
//# sourceMappingURL=firebaseServer.js.map