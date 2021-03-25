var express = require('express');
var router = express.Router();
const controller = require('../controller/index');

const objectController = new controller();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/spotify', function(req, res, next) {
  return objectController.distribute('auth', 'gotoSpotifyLogin', req, res);
});

router.get('/auth/redirect', (req, res, next)=> {
  return objectController.distribute('auth', 'authenticatedDone', req, res);
});

module.exports = router;
