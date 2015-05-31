var Crawler = require("simplecrawler"),
    helpers = require('../helpers');

module.exports = function () {
  var crawler = Crawler.crawl("http://endclothing.co.uk/");

  // настраиваем паука
  crawler.interval = 3000;
  crawler.maxConcurrency = 1;
  crawler.timeout = 5000;
  // crawler.maxDepth = 1;

  crawler.addFetchCondition(function (parsedURL) {
    return !parsedURL.path.match(/\.(jpg|png|gif)$/i);
  });

  crawler.discoverRegex = [new RegExp('(\\shref\\s?=\\s?)[\"](.+(clothing|footwear|accessories)[^\"]+)', 'ig')];

  // получили страницу
  crawler.on("fetchcomplete", function (queueItem, fetchPage, response) {
    if (queueItem.url.match(/\.(html)$/i)) {
      helpers.fetchPage(fetchPage, function (errors, window) {
        this.emit('good_fetched', {
          // главная картинка товара
          img: window.$(".MagicZoomPlus img").attr('src')
        });
      }, this);
    }
  });

  return crawler;
};
