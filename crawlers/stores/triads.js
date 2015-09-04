var helpers = require('../helpers');

module.exports = function () {
  return helpers.initCrawler("http://www.triads.co.uk/triads-mens-c1", {
    itemMatch: /triads\.co\.uk\/triads\-mens\-c1\/[\w\d\-]+\/[\w\d\-]+\/[\w\d\-]+/i,
    discoverRegex: [
      /href=\"(\/triads\-mens\-c1\/[\w\d\-]+\/[\w\d\-]+\/[\w\d\-]+)\"/gi,
      /href=\".+\/triads-mens-c1\?page\=\d{1,}\"/gi
    ],
    onFetch: function (url, window) {
      var name_mod = window.$.trim(window.$('#product_title').text()).split(' - ');

      this.emit('good_fetched', {
        url: url,
        brand: window.$.trim(window.$('#breadcrumb_container span:last').text()),
        name: name_mod[0],
        mod: name_mod[1],
        img: window.$("#product_medium_image").attr('src'),
        price: helpers.parsePrice(window.$('#product_price_sale .inc .GBP').text()),
        price_no_vat: helpers.parsePrice(window.$('#product_price_sale .ex .GBP').text()),
        currency: 'GBP',
        sizes: [], // нет возможности спарсить размеры :(
      });
    }
  });
};
