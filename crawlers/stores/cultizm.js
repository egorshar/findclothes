var helpers = require('../helpers');

module.exports = function () {
  return helpers.initCrawler("http://www.cultizm.com/", {
    itemMatch: /cultizm\.com\/product_info\.php\?info\=/i,
    discoverRegex: [
      /href\=\"(http\:\/\/www\.cultizm\.com\/index\.php\?type\=\d+)\"/gi,
      /href\=\"(http\:\/\/www\.cultizm\.com\/product_info\.php\?info\=[\w\d\-]+\.html)\"/gi,
    ],
    onFetch: function (url, $) {
      var mod = $('#products_information ul li:first').text().split('Style: ');

      this.emit('good_fetched', {
        url: url,
        brand: $('#breadcrumb a:last').prev('a').text(),
        name: $.trim($('#products_information h1').text()),
        mod: !mod[0] ? mod[1] : '',
        img: 'http://www.cultizm.com/' + $("#products_image_selection .MagicZoomPlus img").attr('src'),
        price: helpers.parsePrice($('#products_information .price strong').text()),
        currency: 'EUR',
        sizes: $.makeArray(
          $('#chooser option').map(function () {
            return $.trim($(this).text());
          })
        ),
      });
    }
  });
};
