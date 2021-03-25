var express = require('express');
var router = express.Router();
const controller = require('../controller/index');

const objectController = new controller();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/redirect_url', (req, res, next)=> {
  return objectController.distribute('auth', 'spotify_auth', req, res);
});

module.exports = router;
