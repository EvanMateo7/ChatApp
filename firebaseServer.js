
const admin = require('firebase-admin');

admin.initializeApp({
  // GOOGLE_APPLICATION_CREDENTIALS environment variable
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://chatapp-58582.firebaseio.com'
});

let db = admin.firestore();

db.collection("rooms").doc("ass").set({
  users: ["hole","4448"]
}).catch( e => {console.log(e)});