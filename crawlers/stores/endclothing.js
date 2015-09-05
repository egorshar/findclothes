var helpers = require('../helpers');

module.exports = function () {
  return helpers.initCrawler("http://www.endclothing.com/gb/", {
    itemMatch: /\.(html)$/i,
    discoverRegex: [
      /(\shref\s?=\s?)[\"](.+(clothing|footwear|accessories)[^\"]+)/gi
    ],
    onFetch: function (url, $) {
      var brand = $('.product-info-box a').filter(function () {
            return $(this).attr('href').match(/\/brands\//gi);
          }).text();

      this.emit('good_fetched', {
        url: url,
        brand: brand,
        name: $('h1[itemprop="name"]').text(),
        mod: $('h1[itemprop="name"] + h3').text(),
        img: $(".MagicZoomPlus img").attr('src'),
        price: helpers.parsePrice($('.product-shop.product-description .product-buy-box .price-box .regular-price .price').text()),
        currency: $('.product-shop.product-description .price-box').parent().children('meta').attr('content'),
        sizes:  helpers.getSPConfigSizes($('.product-buy-box .product-options .form-input:first').html()),
      });
    }
  });
};
