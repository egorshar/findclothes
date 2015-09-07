var _ = require('underscore');

module.exports = function () {
  var _this = this, crawler;

  crawler = function () {
    return this.crawl("http://thehipstore.co.uk/collections/all", {
      itemMatch: /\/products\//i,
      discoverRegex: [
        /href=\"((\/products\/)[^\"]+)/gi,
        /href=\"(\/collections\/all(\?page\=\d+(\&[^\"]+)?)?)/gi,
      ],
      debug: true,
      onFetch: function (url, $) {
        var product = $('#product-select option[selected]').text().split(' / '),
            mod_price;

        if (product.length == 1) {
          mod_price = product[0].split(' - ');
          mod_price[0] = '';
        } else {
          mod_price = product[1].split(' - ');
        }

        this.emit('good_fetched', {
          url: url,
          brand: $('.grid__item.three-quarters.portable-one-whole > p.half-bottom:first-child').text(),
          name: $('h1.half-bottom').text(),
          mod: mod_price[0],
          img: $(".product--image-pop img").attr('src'),
          price: _this.parsePrice(mod_price[1]),
          currency: $('#currency-select option[selected]').text(),
          sizes: _.map($('#product-select option'), function (el) {
            return ($(el).text() || '').split(' ')[0];
          }),
        });
      }
    });
  };

  return {
    crawler: _.bind(crawler, this),
    data: {
      name: 'The Hip Store',
      url: 'http://thehipstore.co.uk/',
      logo: '/images/stores/thehipstore.png',
      active: true,
    },
  };
};
