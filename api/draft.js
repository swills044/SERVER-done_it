// draft routing module
var firebase = require('firebase');
var admin = require('firebase-admin');
const db = firebase.firestore();

var express = require('express');
var router = express.Router();


// Home page route.
router.get('/', function (req, res) {
  res.send('communicating with the draft route');
})

// get drafts route.
router.get('/drafts/', async function (req, res) {

  try {
    //First check if userid exist and origin id exists
    const o_id = req.query.origin_id;
    const u_id = req.query.user_id;
    //Use firebase admin to check if the user is permitted


    if (o_id == '' && u_id == ''){
      //No user id or origin id means the request cannot complete
      res.status(500).send('This request needs a user id and origin id');
    }


    //Create path to the firebase drafts document
    const drafts_db_path = db.collection("user_drafts/"+u_id+"/origins/"+o_id+"/drafts");
    var drafts = [];
    var i = 0;
    //Get all drafts in this db drafts_db_path
    const snapshot = await drafts_db_path.get();
    console.log(snapshot.docs.length);
    res.send(snapshot.docs.map(doc => doc.data()))
     // draft.id = doc.id;
     // if (typeof draft.name == 'undefined' || draft.name == ''){
     //   self.unallocated.push(draft);
     // }
     // else {
     //   drafts_.push(draft);
     // }



  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

})

module.exports = router;
