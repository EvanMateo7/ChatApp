var admin = require('firebase-admin');
admin.initializeApp({
    // GOOGLE_APPLICATION_CREDENTIALS environment variable
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://chatapp-58582.firebaseio.com'
});
var db = admin.firestore();
//# sourceMappingURL=firebaseServer.js.map