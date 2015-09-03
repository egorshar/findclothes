var _ = require('underscore'),
    helpers = require('../helpers'),
    // регулярка поиска размеров внутри json-объекта
    re = /\d\",\"label\"\:\"([^\"]+)\"/gi;

module.exports = function () {
  var crawler = helpers.initCrawler("http://www.endclothing.com/gb/");

  crawler
    .on("fetchcomplete", function (queueItem, fetchPage, response) {
      if (queueItem.url.match(/\.(html)$/i)) {
        helpers.fetchPage(fetchPage, function (errors, window) {
          var sizes = [], m,
              brand = window.$('.product-info-box a').filter(function () {
                return window.$(this).attr('href').match(/\/brands\//gi);
              }).text(),
              sizes_str = window.$('.product-buy-box .product-options .form-input:first').html();

          // заполним массив доступных размеров
          // из json-объекта регуляркой
          while ((m = re.exec(sizes_str)) !== null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }

            sizes.push(m[1].split(' ')[0]);
          }

          this.emit('good_fetched', {
            url: queueItem.url,
            brand: brand,
            name: window.$('h1[itemprop="name"]').text(),
            mod: window.$('h1[itemprop="name"] + h3').text(),
            img: window.$(".MagicZoomPlus img").attr('src'),
            price: helpers.parsePrice(window.$('.product-shop.product-description .product-buy-box .price-box .regular-price .price').text()),
            currency: window.$('.product-shop.product-description .price-box').parent().children('meta').attr('content'),
            sizes: _.reject(sizes, function (size) {
              return !size;
            }),
          });
        }, this);
      }
    })
    .discoverRegex = [new RegExp('(\\shref\\s?=\\s?)[\"](.+(clothing|footwear|accessories)[^\"]+)', 'ig')];

  return crawler;
};
