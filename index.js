//FIRST SETUP Firebase
var firebase = require('firebase');
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
const db = firebase.firestore();

//Setup express web server framework
var express = require('express');
var app = express();

//Setup port
const PORT = process.env.PORT || 3000;
app.listen(PORT);

//Setup routes
var draft = require('./api/draft.js');
var origin = require('./api/origin.js');
var auth = require('./api/auth.js');

app.use('/draft', draft);
app.use('/origin', origin);
app.use('/auth', auth);

module.exports = {firebase};
