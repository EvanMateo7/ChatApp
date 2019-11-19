"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
admin.initializeApp({
    // GOOGLE_APPLICATION_CREDENTIALS environment variable
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://chatapp-58582.firebaseio.com'
});
;
var db = admin.firestore();
function addUser(UID, displayName) {
    db.collection('users').doc().set({
        id: UID,
        name: displayName
    }).then(function () { return console.log("User logged in with UID " + UID); })
        .catch(function (e) { return console.error("Error: " + e); });
}
exports.addUser = addUser;
;
//# sourceMappingURL=firebaseServer.js.map