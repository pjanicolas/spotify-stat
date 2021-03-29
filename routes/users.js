var express = require('express');
var router = express.Router();
const controller = require('../controller/index');

const objectController = new controller();

/* GET users listing. */
router.get('/:userid', function(req, res, next) {
  return objectController.distribute('user', 'view', req, res);
});

module.exports = router;
