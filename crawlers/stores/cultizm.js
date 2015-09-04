var helpers = require('../helpers');

module.exports = function () {
  var crawler = helpers.initCrawler("http://www.cultizm.com/");

  crawler
    .on("fetchcomplete", function (queueItem, fetchPage, response) {
      // console.log(queueItem.url);
      if (queueItem.url.match(/cultizm\.com\/product_info\.php\?info\=/i)) {
        helpers.fetchPage(fetchPage, function (errors, window) {
          var mod = window.$('#products_information ul li:first').text().split('Style: ');

          this.emit('good_fetched', {
            url: queueItem.url,
            brand: window.$('#breadcrumb a:last').prev('a').text(),
            name: window.$.trim(window.$('#products_information h1').text()),
            mod: !mod[0] ? mod[1] : '',
            img: 'http://www.cultizm.com/' + window.$("#products_image_selection .MagicZoomPlus img").attr('src'),
            price: helpers.parsePrice(window.$('#products_information .price strong').text()),
            currency: 'EUR',
            sizes: window.$.makeArray(
              window.$('#chooser option').map(function () {
                return window.$.trim(window.$(this).text());
              })
            ),
          });
        }, this);
      }
    })
    .discoverRegex = [
      /href\=\"(http\:\/\/www\.cultizm\.com\/index\.php\?type\=\d+)\"/gi,
      /href\=\"(http\:\/\/www\.cultizm\.com\/product_info\.php\?info\=[\w\d\-]+\.html)\"/gi,
    ];

  return crawler;
};
