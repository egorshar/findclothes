var helpers = require('../helpers');

module.exports = function () {
  return helpers.initCrawler("http://tres-bien.com/categories/", {
    itemMatch: /tres\-bien\.com\/[\w\d\-]+\/[\w\d\-]+/i,
    discoverRegex: [
      /href=\"(\/[\w\d\-]+\/[\w\d\-]+)\"/gi,
      /href=\".+\/categories\?p\=\d{1,}\"/gi
    ],
    onFetch: function (url, window) {
      this.emit('good_fetched', {
        url: url,
        brand: window.$.trim(window.$('.product-info-container h2').text()),
        name: window.$.trim(window.$('.product-info-container h1').text()),
        mod: window.$.trim(window.$('.product-info-container .product-short-desc li:first span').text()),
        img: window.$(".product-image img[rel=\"productPhoto\"]:first").attr('src'),
        price: helpers.parsePrice(window.$('.product-info-container .regular-price').text()),
        currency: 'EUR',
        sizes: helpers.getSPConfigSizes(window.$('.product-info-container').html()),
      });
    }
  });
};
