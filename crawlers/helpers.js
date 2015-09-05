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

  initCrawler: function (url, options) {
    var crawler = Crawler.crawl(url),
        helpers = this;

    options = options || {};

    // настраиваем паука
    crawler.interval = 300;
    crawler.maxConcurrency = 1;
    crawler.timeout = 5000;

    crawler.addFetchCondition(this.excludeCondition);

    crawler.discoverRegex = options.discoverRegex;

    if (options.discoverResources) {
      crawler.discoverResources = options.discoverResources;
    }

    crawler
      .on("fetchcomplete", function (queueItem, fetchPage, response) {
        if (options.debug) {
          console.log('page fetched: ', queueItem.url);
          // console.log(response);
        }
        if (queueItem.url.match(options.itemMatch)) {
          if (options.debug) {
            console.log('item matched: ', queueItem.url);
          } else {
            helpers.fetchPage(fetchPage, function (errors, window) {
              // console.log(window.$('body').html());
              if (_.isFunction(options.onFetch)) {
                options.onFetch.apply(this, [queueItem.url, window]);
              }
            }, this);
          }
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
  }
};
