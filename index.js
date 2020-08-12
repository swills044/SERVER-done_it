//FIRST SETUP Firebase
var firebase = require('firebase');
var admin = require('firebase-admin');
// Your web apps Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCv08M_KtxrZBx-7rFszbHcxkoR5Amdelc",
  authDomain: "doneit-server.firebaseapp.com",
  databaseURL: "https://doneit-server.firebaseio.com",
  projectId: "doneit-server",
  storageBucket: "doneit-server.appspot.com",
  messagingSenderId: "124319996034",
  appId: "1:124319996034:web:0acc8a143c9101b52c3c9b",
  measurementId: "G-FSMY21275G"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://<doneit-server>.firebaseio.com'
});
const db = firebase.firestore();

//Setup express web server framework
var express = require('express');
var app = express();

var cors = require('cors');

//
// var cors = require('cors')
//
// var app = express()
// app.use(cors())

//Setup port
const PORT = process.env.PORT || 3000;
app.listen(PORT);

app.get('/', function (req, res) {
  res.send('the doneit server');
})

//Middleware
app.use(function (req, res, next) {
  // idToken comes from the client app
  admin.auth().verifyIdToken(req.query.token)
  .then(function(decodedToken) {

    req.query.user_id = decodedToken.uid;
    next();
    // ...
  }).catch(function(error) {
    console.log(error);
    res.status(400).send(error.message);
  });
})

app.use(express.json()); //Used to parse JSON bodies
app.use(cors());

// app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", '*');
//    res.header("Access-Control-Allow-Credentials", true);
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//    next();
// });

//Setup routes
var draft = require('./api/draft.js');
var origin = require('./api/origin.js');
//var auth = require('./api/auth.js');

app.use('/draft', draft);
app.use('/origin', origin);
//app.use('/auth', auth);

module.exports = {firebase};
