var _ = require('underscore');

module.exports = function () {
  var _this = this, crawler;

  crawler = function () {
    return this.crawl("http://www.endclothing.com/gb/", {
      itemMatch: /[\w\d\-\.\/\:]+\.html/gi,
      discoverRegex: [
        /href=\"(http:\/\/www\.endclothing\.com\/\w{1,2}\/(clothing|footwear|accessories)(\?p\=\d+)?)/gi,
        /href=\"(http[\w\d\-\.\/\:]+\.html)/gi
      ],
      debug: true,
      onFetch: function (url, $) {
        var brand = _.filter($('.product-info-box a'), function (el) {
              return ($(el).attr('href') || '').match(/\/brands\//gi);
            });

        this.emit('good_fetched', {
          url: url,
          brand: $(brand[0]).text().split("'")[0],
          name: $('h1[itemprop="name"]').text(),
          mod: $('h1[itemprop="name"] + h3').text(),
          img: $(".MagicZoomPlus img").attr('src'),
          price: _this.parsePrice($('.product-shop.product-description .product-buy-box .price-box .regular-price .price').text()),
          currency: $('.product-shop.product-description .price-box').parent().children('meta').attr('content'),
          sizes:  _this.getSPConfigSizes($('#product-options-wrapper').html()),
        });
      }
    });
  };

  return {
    crawler: _.bind(crawler, this),
    data: {
      name: 'Endclothing',
      url: 'http://www.endclothing.com/',
      logo: '/images/stores/end.png',
      active: true,
    },
  };
};
