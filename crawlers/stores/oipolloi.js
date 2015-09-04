var helpers = require('../helpers');

module.exports = function () {
  return helpers.initCrawler("http://www.oipolloi.com/collections/in-stock/", {
    itemMatch: /collections\/in\-stock\/products\//i,
    discoverRegex: [
      /(\shref\s?=\s?)[\"](.+(collections\/in-stock\/)[^\"]+)/gi
    ],
    onFetch: function (url, window) {
      var mod = window.$('.product-name span').text();

      window.$('.product-name span').remove();

      this.emit('good_fetched', {
        url: url,
        brand: window.$('.product-title .product-brand a').text(),
        name: window.$.trim(window.$('.product-name').text()),
        mod: mod,
        img: window.$(".product-photo-container img").attr('src'),
        price: helpers.parsePrice(window.$('.price.price-full.price-inc-vat .money').text()),
        price_no_vat: helpers.parsePrice(window.$('.price.price-fullprice-no-vat .money').text()),
        currency: window.$('.price.price-fullprice-no-vat .money').attr('data-currency'),
        sizes: window.$.makeArray(
          window.$('.size-row .btn:not(.disabled)').map(function () {
            return window.$(this).text();
          })
        ),
      });
    }
  });
};
