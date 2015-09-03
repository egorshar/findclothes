// var _ = require('underscore'),
//     helpers = require('../helpers');
//
// module.exports = function () {
//   var crawler = helpers.initCrawler("http://www.cultizm.com/shop_content.php?coID=20");
//
//   crawler
//     .on("fetchcomplete", function (queueItem, fetchPage, response) {
//       console.log(queueItem.url);
//       if (queueItem.url.match(/collections\/in\-stock\/products\//i)) {
//         helpers.fetchPage(fetchPage, function (errors, window) {
//           var mod = window.$('.product-name span').text();
//
//           window.$('.product-name span').remove();
//
//           this.emit('good_fetched', {
//             url: queueItem.url,
//             brand: window.$('.product-title .product-brand a').text(),
//             name: window.$.trim(window.$('.product-name').text()),
//             mod: mod,
//             img: window.$(".product-photo-container img").attr('src'),
//             price: helpers.parsePrice(window.$('.price.price-full.price-inc-vat .money').text()),
//             price_no_vat: helpers.parsePrice(window.$('.price.price-fullprice-no-vat .money').text()),
//             currency: window.$('.price.price-fullprice-no-vat .money').attr('data-currency'),
//             sizes: window.$.makeArray(
//               window.$('.size-row .btn:not(.disabled)').map(function () {
//                 return window.$(this).text();
//               })
//             ),
//           });
//         }, this);
//       }
//     })
//     // .discoverRegex = [/(product_info\.php\?info\=))/gi];
//
//   return crawler;
// };
