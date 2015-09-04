var _ = require('underscore'),
    Crawler = require("simplecrawler"),
    jsdom = require("jsdom"),

    // регулярка поиска размеров внутри json-объекта
    re = /\d\",\"label\"\:\"([^\"]+)\"/gi;

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
    return (price || '').toString().replace(/\,/gi, '.').replace(/[^\d\.]/gi, '');
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

  getSPConfigSizes: function (html_with_script) {
    var sizes = [], m;

    // заполним массив доступных размеров
    // из json-объекта регуляркой
    while ((m = re.exec(html_with_script)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }

      sizes.push(m[1].split(' ')[0]);
    }

    return _.reject(sizes, function (size) {
      return !size;
    });
  }
};
