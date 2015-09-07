var _ = require('underscore');

module.exports = function () {
  var _this = this, crawler;

  crawler = function () {
    return this.crawl("http://www.oipolloi.com/collections/in-stock/", {
      itemMatch: /collections\/in\-stock\/products\//i,
      discoverRegex: [
        /(\shref\s?=\s?)[\"](.+(collections\/in-stock\/)[^\"]+)/gi
      ],
      debug: true,
      onFetch: function (url, $) {
        var mod = $('.product-name span').text();

        $('.product-name span').remove();

        this.emit('good_fetched', {
          url: url,
          brand: $('.product-title .product-brand a').text(),
          name: $('.product-name').text(),
          mod: mod,
          img: $(".product-photo-container img").attr('src'),
          price: _this.parsePrice($('.price.price-full.price-inc-vat .money').text()),
          price_no_vat: _this.parsePrice($('.price.price-full.price-no-vat .money').text()),
          currency: $('.price.price-full.price-inc-vat .money').attr('data-currency'),
          sizes: _.map($('.size-row .btn:not(.disabled)'), function (el) {
            return $(el).text();
          }),
        });
      }
    });
  };

  return {
    crawler: _.bind(crawler, this),
    data: {
      name: 'Oi Polloi',
      url: 'http://www.oipolloi.com/',
      logo: '/images/stores/oipolloi.png',
      active: true,
    },
  };
};
