var express = require('express');
var Good = require('../models/good');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  Good.list(req.param.page).then(function (goods) {
    res.render('index', {
      title: 'WAAANT',
      goods: goods,
    });
  });
});

router.get('/search', function (req, res) {
  res.json({});
});

module.exports = router;
