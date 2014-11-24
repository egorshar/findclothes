var express = require('express');
// var request = require('request');
var router = express.Router();

var jsdom = require("jsdom");
var fs = require("fs");
var jquery = fs.readFileSync("./public/javascripts/vendor/jquery/dist/jquery.js", "utf-8");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Express'
  });
});

/* GET search page */
router.get('/fetch', function(req, res) {
  if (req.query && req.query.page) {

    jsdom.env({
      url: decodeURIComponent(req.query.page),
      src: [jquery],
      done: function (errors, window) {
        var $ = window.$;
        // console.log("HN Links");
        // console.log($('body'));
        res.send($('body').html());
        // $("td.title:not(:last) a").each(function () {
        //   console.log(" -", $(this).text());
        // });
      }
    });
    // request(decodeURIComponent(req.query.page), function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     res.send(body);
    //   }
    // });
  }
});

module.exports = router;
