var _ = require('underscore');

module.exports = function () {
  var _this = this, crawler;

  crawler = function () {
    return this.crawl("http://www.triads.co.uk/triads-mens-c1", {
      itemMatch: /triads\.co\.uk\/triads\-mens\-c1\/[\w\d\-]+\/[\w\d\-]+\/[\w\d\-]+/i,
      discoverRegex: [
        /href=\"(\/triads\-mens\-c1\/[\w\d\-]+\/[\w\d\-]+\/[\w\d\-]+)\"/gi,
        /href=\".+\/triads-mens-c1\?page\=\d{1,}\"/gi
      ],
      debug: true,
      onFetch: function (url, $) {
        var name_mod = $('#product_title').text().split(' - ');

        this.emit('good_fetched', {
          url: url,
          brand: $('#breadcrumb_container span:last-child').text(),
          name: name_mod[0],
          mod: name_mod[1],
          img: $("#product_medium_image").attr('src'),
          price: _this.parsePrice($('#product_price_sale .inc .GBP').text()),
          price_no_vat: _this.parsePrice($('#product_price_sale .ex .GBP').text()),
          currency: 'GBP',
          sizes: [], // нет возможности спарсить размеры :(
        });
      },
    });
  };

  return {
    crawler: _.bind(crawler, this),
    data: {
      name: 'Triads',
      url: 'http://www.triads.co.uk/',
      logo: '/images/stores/triads.png',
      active: true,
    },
  };
};
