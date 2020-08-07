// origin routing module

var express = require('express');
var router = express.Router();

// test route.
router.get('/', function (req, res) {
  res.send('communicating with the origin route');
})

// get origin route.
router.get('/:id', function (req, res) {
  res.send(req.params);
})

module.exports = router;
