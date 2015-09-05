var _ = require('underscore');
var mongodb = require('mongodb').MongoClient;
var stores = [require('./stores/peggsandson')];
var helpers = require('./helpers');
// var stores = [
//   require('./stores/endclothing'),
//   require('./stores/oipolloi'),
//   require('./stores/thehipstore'),
//   require('./stores/tres-bien'),
//   require('./stores/triads'),
//   require('./stores/cultizm'),
//   require('./stores/peggsandson'),
// ];

var initStoreCrawler = function () {
  var stores_names = Object.keys(stores),
      crawler;

  // проверим, остались ли еще пауки вообще
  if (stores[stores_names[0]]) {
    mongodb.connect('mongodb://localhost:27017/waaant', function(err, db) {
      // console.log(err, db);
      crawler = stores[stores_names[0]].call(helpers);

      crawler
        .on('complete', function () {
          console.log('Completed: "' + stores_names[0] + '"');
          db.close();
          // закончили с магазином,
          // запускаем поиск еще в одном
          initStoreCrawler();
        })
        .on('good_fetched', function (good) {
          db.collection('products').insert(good);
          console.log(good);
        });

      crawler.store_name = stores_names[0];
      delete stores[stores_names[0]];
    });
  } else {
    console.log('All stores crawlered');
  }
};

module.exports = initStoreCrawler;
