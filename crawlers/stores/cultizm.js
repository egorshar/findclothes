var _ = require('underscore');

module.exports = function () {
  var _this = this, crawler;

  crawler = function () {
    return this.crawl("http://www.cultizm.com/", {
      itemMatch: /cultizm\.com\/product_info\.php\?info\=/i,
      discoverRegex: [
        /href\=\"(http\:\/\/www\.cultizm\.com\/index\.php\?type\=\d+)\"/gi,
        /href\=\"(http\:\/\/www\.cultizm\.com\/product_info\.php\?info\=[\w\d\-]+\.html)\"/gi,
      ],
      debug: true,
      onFetch: function (url, $) {
        var mod = $('#products_information .price + ul li:first-child').text().split('Style: ');

        this.emit('good_fetched', {
          url: url,
          brand: $('#breadcrumb a:last-child').prev('a').text(),
          name: $('#products_information h1').text(),
          mod: !mod[0] ? mod[1] : '',
          img: 'http://www.cultizm.com/' + $("#products_image_selection .MagicZoomPlus img").attr('src'),
          price: _this.parsePrice($('#products_information .price strong').text()),
          currency: 'EUR',
          sizes: _.map($('#chooser option'), function (el) {
            return $(el).text();
          }),
        });
      }
    });
  };

  return {
    crawler: _.bind(crawler, this),
    data: {
      name: 'Cultizm',
      url: 'http://www.cultizm.com/',
      logo: '/images/stores/cultizm.png',
      active: true,
    },
  };
};
