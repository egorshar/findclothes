var express = require('express');
var router = express.Router();

var Good = require('../models/good');

/* GET home page. */
router.get('/', function(req, res) {
  Good.random().then(function (goods) {
    res.render('index', {
      title: 'WAAANT',
      goods: goods,
    });
  });
});

/* explore goods */
router.get('/find', function (req, res) {
  Good.list(
      {
        search: req.query.search,
      },
      req.query.page
    )
    .then(function (goods) {
      res.json(goods);
    });
});

module.exports = router;
