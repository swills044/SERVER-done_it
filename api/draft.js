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


    if (o_id == '' && u_id == '') {
      //No user id or origin id means the request cannot complete
      res.status(500).send('This request needs a user id and origin id');
    }


    //Create path to the firebase drafts document
    const drafts_db_path = db.collection("user_drafts/" + u_id + "/origins/" + o_id + "/drafts");
    var drafts = [];
    var i = 0;
    //Get all drafts in this db drafts_db_path
    const snapshot = await drafts_db_path.get();
    var childs = snapshot.docs.map(doc => doc.data());

    //Check if there are any chileran
    if (childs.length == 0) {
      res.status(200).send('No drafts here!');
    } else {
      sortParentChild(childs);
    }

    function sortParentChild(childs) {
      //Make childs go from first child/parent to last child/parent (A hierachy)
      //Sort by length of the path/id

      //The id will be in 2s
      var counter = 2;
      var sortedChilds = [];
      var sortedLevel = [];
      var tempArr = [];

      loopChilds();

      function loopChilds() {
        for (var i = 0; i < childs.length; i++) {
          //This will check if the array level is matching, starting from the length of 2 (the starting array length because each id has 2 values)

          if (childs[i].path.length === counter) {
            tempArr.push(childs[i]);
          }

          //This will check if its the end of the array and if so go to the next level of array
          if (i == childs.length - 1) {
            counter = counter + 2;

          }

          //This will check if there is any more childs to loop and if so it will loop the array again
          if (tempArr.length > 0 && i == childs.length - 1) {
            //Then sort this array level by number
            var sortedLevel = sortArrayLevel(tempArr);
            tempArr = [];
            //Add values to the end of the array
            sortedChilds.push(...sortedLevel);
            loopChilds();
          }
        }
      }

      //
      //Helpers
      //
      function sortArrayLevel(arr) {
        //Loop array using the
        arr.sort(function (a, b) {
          //Use only the last two digits for this array level
          var a1 = a.path.substring(a.path.length - 2, a.path.length);
          var b1 = b.path.substring(b.path.length - 2, b.path.length);

          //First remove any underscores
          var pathA = a1.replace('_', '');
          var pathB = b1.replace('_', '');
          //Convert to string
          //Return comparison

          return Number(pathA) - Number(pathB);
        })
        return arr;
      }


      createArrayStructure(sortedChilds);

    }

    function createArrayStructure(childs) {
      //Loop through hierachy creating arrays to represent the heirachy :
      //Loop through array structure, each branch should be filled out with the correct ids/paths and those paths should be removed from the branch index so there is never two ids

      //Childs are sorted so we need to create arrays inside every child called childs, which can be filled with the childs below it
      // Use helper functions for filling the branch with a index of all ids used

      //Two different algo:
      /*
      -->go through each child and push their object into the specific array, creating new child arrays when neeeded

      go through each child and fill any childs that belong in its branch of nodes

      */

      var arr = []

      childs.forEach(function (child, i) {

        console.log(child.path, child.path.length);
        var arrLevel = child.path.length;
        //var index = Number(child.path.replace('_', ''));

        child['childs'] = [];
        //Need to access the branch by looping through the correct branches
        if (i == 0) {
          arr.push({
            childs: [],
            index: createBranchIndex
          })
        }
        getBranchRef(child.path, childs).push(child);

      })



    }

    function completeResponse(arr) {
      res.send(arr);
    }

    //
    //Helpers
    //

    function getBranchRef(path, childs) {
      var arrLevel = path.length;
      var tempRef = [];
      var parentRef = [];
      for (var i = 0; i <= arrLevel; i++) {
        //Get the index of the path
        var string_i = path.split(i, i + 1);
        //Create a parent reference
        if (i != arrLevel) {
          parentRef = arr[i].childs;
        }

        //Access child
        if (i == 0) {
          tempRef = arr[0].childs;
        } else {
          tempRef = arr[i].childs;
        }

        if (i == arrLevel) {
          //Remove an index from the parents index list
          removeIndexFromParent(parentRef);
          return tempRef;
        }
      }
    }

    function createBranchIndex() {
      //object with array of 99 indexes that can be used up
      var indexes = [];
      var index_amount = 99;
      for (var i = 0; i < index_amount; i++) {
        indexes.push(i);
      }
      return indexes;
    }

    function removeIndexFromParent(parent) {
      parent.indexes.pop();
    }




    // draft.id = doc.id;
    // if (typeof draft.path == 'undefined' || draft.path == ''){
    //   self.unallocated.push(draft);
    // }
    // else {
    //   drafts_.push(draft);
    // }



  } catch (e) {
    res.status(500).send(e);
  }

})

module.exports = router;