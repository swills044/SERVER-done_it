var firebase = require('firebase');
var admin = require('firebase-admin');
admin.initializeApp();
module.exports = (req, res, next) => {

  var token=
  firebase.auth().currentUser.getToken();
  // try {
  //   token = req.header('Authorization').replace('Bearer', '').trim()
  // } catch(e){
  //   res.status(400).send({err: e, msg: 'Needs a user token'})
  // }
  admin.auth().verifyIdToken(token)
  .then(function (decodedToken) {
      if(decodedToken.uid === req.params.user_id)
      {
         return next()
      }
   }).catch(function (error) {
     res.status(400).send({err: error, msg: 'User token not valid'})
   });
};
