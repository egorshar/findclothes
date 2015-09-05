var helpers = require('../helpers');

module.exports = function () {
  return helpers.initCrawler("http://www.oipolloi.com/collections/in-stock/", {
    itemMatch: /collections\/in\-stock\/products\//i,
    discoverRegex: [
      /(\shref\s?=\s?)[\"](.+(collections\/in-stock\/)[^\"]+)/gi
    ],
    onFetch: function (url, $) {
      var mod = $('.product-name span').text();

      $('.product-name span').remove();

      this.emit('good_fetched', {
        url: url,
        brand: $('.product-title .product-brand a').text(),
        name: $.trim($('.product-name').text()),
        mod: mod,
        img: $(".product-photo-container img").attr('src'),
        price: helpers.parsePrice($('.price.price-full.price-inc-vat .money').text()),
        price_no_vat: helpers.parsePrice($('.price.price-fullprice-no-vat .money').text()),
        currency: $('.price.price-fullprice-no-vat .money').attr('data-currency'),
        sizes: $.makeArray(
          $('.size-row .btn:not(.disabled)').map(function () {
            return $(this).text();
          })
        ),
      });
    }
  });
};
