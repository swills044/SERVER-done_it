// draft routing module
var firebase = require('firebase');
const db = firebase.firestore();

var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.send('communicating with the draft route');
})

// get drafts route.
router.get('/drafts/', function (req, res) {
  //First check if userid exist and origin id exists
  const o_id = req.query.origin_id;
  const u_id = req.query.user_id;

  if (o_id == '' && u_id == ''){
    //No user id or origin id means the request cannot complete
    res.status(500).send('This request needs a user id and origin id');
  }


  //Create path to the firebase drafts document
  const drafts_db_path = db.collection("user_drafts/"+u_id+"/origins/"+o_id+"/drafts");
  var drafts;
  //Get all drafts in this db drafts_db_path
  drafts_db_path.get().then((drafts_snapshot) => {
    drafts = drafts_snapshot.docs.map((draft, index, array)=>{
      return draft;
    })
    res.send(drafts);
  })
})

module.exports = router;
