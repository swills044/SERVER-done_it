// login and register routing module

var firebase = require('firebase');

var express = require('express');
var router = express.Router();

// test route.
router.post('/login', function (req, res) {
  const email = req.query.email;
  const pass = req.query.password;
  firebase.auth().signInWithEmailAndPassword(email, pass).catch(error => {
          res.status(400).send('Incorrect email or password');
        }).then(
          user => {
             res.send({user: user})

          }
        )

});

router.post('/register', function (req, res) {
  const email = req.query.email;
  const pass = req.query.password;
  firebase.auth().createUserWithEmailAndPassword(email, pass).catch(error => {
          res.status(400).send(error);
        }).then(user => {
          res.send({user: user});
        });

});
module.exports = router;
