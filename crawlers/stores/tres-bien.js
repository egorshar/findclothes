var _ = require('underscore');

module.exports = function () {
  var _this = this, crawler;

  crawler = function () {
    return this.crawl("http://tres-bien.com/categories/", {
      itemMatch: /tres\-bien\.com\/[\w\d\-]+\/[\w\d\-]+/i,
      discoverRegex: [
        /href=\"(\/[\w\d\-]+\/[\w\d\-]+)\"/gi,
        /href=\".+\/categories\?p\=\d{1,}\"/gi
      ],
      debug: true,
      onFetch: function (url, $) {
        this.emit('good_fetched', {
          url: url,
          brand: $('.product-info-container h2').text(),
          name: $('.product-info-container h1').text(),
          mod: $('.product-info-container .product-short-desc li:first-child span').text(),
          img: $(".product-image img[rel=\"productPhoto\"]:first-child").attr('src'),
          price: _this.parsePrice($('.product-info-container .regular-price').text()),
          currency: 'EUR',
          sizes: _this.getSPConfigSizes($('.product-info-container').html()),
        });
      }
    });
  };

  return {
    crawler: _.bind(crawler, this),
    data: {
      name: 'Très Bien',
      url: 'http://tres-bien.com/',
      logo: '/images/stores/tresbien.png',
      active: true,
    },
  };
};
