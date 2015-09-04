var helpers = require('../helpers');

module.exports = function () {
  var crawler = helpers.initCrawler("http://tres-bien.com/categories/");

  crawler
    .on("fetchcomplete", function (queueItem, fetchPage, response) {
      if (queueItem.url.match(/tres\-bien\.com\/[\w\d\-]+\/[\w\d\-]+/i)) {
        helpers.fetchPage(fetchPage, function (errors, window) {
          this.emit('good_fetched', {
            url: queueItem.url,
            brand: window.$.trim(window.$('.product-info-container h2').text()),
            name: window.$.trim(window.$('.product-info-container h1').text()),
            mod: window.$.trim(window.$('.product-info-container .product-short-desc li:first span').text()),
            img: window.$(".product-image img[rel=\"productPhoto\"]:first").attr('src'),
            price: helpers.parsePrice(window.$('.product-info-container .regular-price').text()),
            currency: 'EUR',
            sizes: helpers.getSPConfigSizes(window.$('.product-info-container').html()),
          });
        }, this);
      }
    })
    .discoverRegex = [
      /href=\"(\/[\w\d\-]+\/[\w\d\-]+)\"/gi,
      /href=\".+\/categories\?p\=\d{1,}\"/gi
    ];

  return crawler;
};
