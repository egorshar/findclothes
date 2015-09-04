var _ = require('underscore'),
    requireDir = require('require-dir'),

    config = require('./config'),
    // stores = requireDir('./stores'),
    // stores = [
    //   require('./stores/endclothing'),
    //   require('./stores/oipolloi'),
    //   require('./stores/thehipstore'),
    //   require('./stores/tres-bien'),
    //   require('./stores/triads'),
    // ],
    stores = [require('./stores/cultizm')],

    initStoreCrawler;

initStoreCrawler = function () {
  var stores_names = Object.keys(stores),
      crawler;

  // проверим, остались ли еще пауки вообще
  if (stores[stores_names[0]]) {
    crawler = stores[stores_names[0]]();

    crawler
      .on('complete', function () {
        console.log('Completed: "' + stores_names[0] + '"');
        // закончили с магазином,
        // запускаем поиск еще в одном
        initStoreCrawler();
      })
      .on('good_fetched', function (good) {
        console.log(good);
      });

    crawler.store_name = stores_names[0];
    delete stores[stores_names[0]];
  } else {
    console.log('All stores crawlered');
  }
};

initStoreCrawler();
