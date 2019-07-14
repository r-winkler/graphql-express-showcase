var express = require('express');
var router = express.Router();
var fs = require('fs');

function getPersonsFromJson() {
  var rawdata = fs.readFileSync('persons.json');
  return JSON.parse(rawdata);
}


/* GET persons */
router.get('/', function(req, res, next) {
  res.json(getPersonsFromJson())
});

/* GET person by id */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  res.json(getPersonsFromJson().find(p => p.id == id))
});



module.exports = router;
