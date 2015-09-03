var _ = require('underscore'),
    Crawler = require("simplecrawler"),
    jsdom = require("jsdom");

module.exports = {
  fetchPage: function (buffer, callback, context) {
    jsdom.env({
      html: buffer,
      scripts: ["http://code.jquery.com/jquery.js"],
      done: _.bind(callback, context || this)
    });
  },

  excludeCondition: function (parsedURL) {
    return !parsedURL.uriPath.match(/\.(css|js|ico|jpg|png|gif)$/i);
  },

  parsePrice: function (price) {
    return (price || '').toString().replace(/[^\d\.]/gi, '');
  },

  initCrawler: function (url) {
    var crawler = Crawler.crawl(url);

    // настраиваем паука
    crawler.interval = 100;
    crawler.maxConcurrency = 1;
    crawler.timeout = 5000;

    crawler.addFetchCondition(this.excludeCondition);

    return crawler;
  },
};
