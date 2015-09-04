var helpers = require('../helpers');

module.exports = function () {
  var crawler = helpers.initCrawler("http://www.endclothing.com/gb/");

  crawler
    .on("fetchcomplete", function (queueItem, fetchPage, response) {
      if (queueItem.url.match(/\.(html)$/i)) {
        helpers.fetchPage(fetchPage, function (errors, window) {
          var brand = window.$('.product-info-box a').filter(function () {
                return window.$(this).attr('href').match(/\/brands\//gi);
              }).text();

          this.emit('good_fetched', {
            url: queueItem.url,
            brand: brand,
            name: window.$('h1[itemprop="name"]').text(),
            mod: window.$('h1[itemprop="name"] + h3').text(),
            img: window.$(".MagicZoomPlus img").attr('src'),
            price: helpers.parsePrice(window.$('.product-shop.product-description .product-buy-box .price-box .regular-price .price').text()),
            currency: window.$('.product-shop.product-description .price-box').parent().children('meta').attr('content'),
            sizes:  helpers.getSPConfigSizes(window.$('.product-buy-box .product-options .form-input:first').html()),
          });
        }, this);
      }
    })
    .discoverRegex = [
      /(\shref\s?=\s?)[\"](.+(clothing|footwear|accessories)[^\"]+)/gi
    ];

  return crawler;
};
