// var _ = require('underscore'),
//     Crawler = require("simplecrawler"),
//     helpers = require('../helpers');
//
// module.exports = function () {
//   var crawler = Crawler.crawl("http://www.triads.co.uk/");
//
//   // настраиваем паука
//   crawler.interval = 3000;
//   crawler.maxConcurrency = 1;
//   crawler.timeout = 5000;
//
//   crawler.addFetchCondition(function (parsedURL) {
//     return !parsedURL.uriPath.match(/\.(css|js|ico|jpg|png|gif)$/i);
//   });
//
//   crawler.discoverRegex = [new RegExp('(\\shref\\s?=\\s?)[\"](.+(clothing|footwear|accessories)[^\"]+)', 'ig')];
//
//   // получили страницу
//   crawler.on("fetchcomplete", function (queueItem, fetchPage, response) {
//     if (queueItem.url.match(/\.(html)$/i)) {
//       helpers.fetchPage(fetchPage, function (errors, window) {
//         var sizes = window.$.makeArray(
//               window.$('.product-buy-box .super-attribute-select option').map(function () {
//                 var val = window.$(this).val().split([' ']);
//                 return val[0] == 'Choose' ? '' : val[0];
//               })
//             ),
//             brand = window.$('.product-info-box a').filter(function () {
//               return window.$(this).attr('href').match(/\/brands\//gi);
//             }).text();
//
//         this.emit('good_fetched', {
//           url: queueItem.url,
//           brand: brand,
//           name: window.$('h1[itemprop="name"]').text(),
//           mod: window.$('h1[itemprop="name"] + h3').text(),
//           img: window.$(".MagicZoomPlus img").attr('src'),
//           price: window.$('.price-box .regular-price .price').text(),
//           sizes: _.reject(sizes, function (size) {
//             return !size;
//           }),
//         });
//       }, this);
//     }
//   });
//
//   return crawler;
// };
