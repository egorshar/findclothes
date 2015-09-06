var _ = require('underscore'),
    Crawler = require("simplecrawler"),
    cheerio = require('cheerio'),

    // регулярка поиска размеров внутри json-объекта
    re = /\d\",\"label\"\:\"([^\"]+)\"/gi;

module.exports = {
  fetchPage: function (buffer, callback, context) {
    var $ = cheerio.load(buffer.toString('utf8'));

    callback.call(context || this, $);
  },

  excludeCondition: function (parsedURL) {
    return !parsedURL.uriPath.match(/\.(css|js|ico|jpg|png|gif)$/i);
  },

  parsePrice: function (price) {
    return (price || '').toString().replace(/\,/gi, '.').replace(/[^\d\.]/gi, '');
  },

  crawl: function (url, options) {
    var crawler = Crawler.crawl(url),
        helpers = this;

    options = options || {};

    // настраиваем паука
    crawler.interval = 2000;
    crawler.maxConcurrency = 1;
    crawler.timeout = 5000;

    crawler.addFetchCondition(this.excludeCondition);

    crawler.discoverRegex = options.discoverRegex;

    if (options.discoverResources) {
      crawler.discoverResources = options.discoverResources;
    }

    crawler
      .on("fetchcomplete", function (queueItem, fetchPage, response) {
        if (queueItem.url.match(options.itemMatch)) {
          if (options.debug) {
            console.log('item matched: ', queueItem.url);
          }

          helpers.fetchPage(fetchPage, function ($) {
            if (_.isFunction(options.onFetch)) {
              options.onFetch.apply(this, [queueItem.url, $]);
            }
          }, this);
        } else {
          console.log('page fetched, not matched: ', queueItem.url);
        }
      });

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
  },
};
