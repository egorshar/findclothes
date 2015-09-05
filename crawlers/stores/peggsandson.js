var _ = require('underscore');

module.exports = function () {
  var _this = this;

  return this.crawl("http://www.peggsandson.com/clothing", {
    itemMatch: /http\:\/\/www\.peggsandson\.com\/((?!clothing).+)/i,
    discoverRegex: [
      /(\shref\s?\=\s?)[\"](http\:\/\/www\.peggsandson\.com\/clothing\/[^\"]+)/gi,
      /(\shref\s?\=\s?)[\"](http\:\/\/www\.peggsandson\.com\/([^\"]+))(\" title)/gi
    ],
    // для peggsandson
    // не подходит стандартный поиск ссылок
    // от simplecrawler, поэтому определим свой
    discoverResources: function (buf, queueItem) {
      var resourceText = buf.toString('utf8');

      return this.discoverRegex
          .reduce(function(list, regex) {
            var linksMatched = resourceText.match(regex),
                linksCleaned;

            if (linksMatched) {
              linksCleaned = list.concat(linksMatched.reduce(function (list, link) {
                return list.concat(link.replace(/\shref\=\"([^\"]+)(\" title)?/, '$1'));
              }, []));

              return linksCleaned;
            } else {
              return list;
            }
          }, [])
          .reduce(function (list, check) {
            if (list.indexOf(check) < 0) {
              return list.concat([check]);
            }

            return list;
          }, []);
    },
    // debug: true,
    onFetch: function (url, $) {
      var $name = $('.product-shop .product-name h1'),
          name_mod;

      name_mod = $name.text().split(' - ');
      $('.product-name span').remove();

      this.emit('good_fetched', {
        url: url,
        brand: $('.header-detail.manufacture h2 a').text(),
        name: $.trim(name_mod[0]),
        mod: name_mod[1],
        img: $(".product-img-container img").attr('src'),
        price: _this.parsePrice($('.product-shop .price-box .regular-price:first').text()),
        currency: 'GBP',
        sizes: _.reduce(_this.getSPConfigSizes($('#product-options-wrapper').html()), function (new_sizes, size) {
          if ((size || '').toString().toLowerCase() != 'please') {
            return new_sizes.concat([size]);
          }

          return new_sizes;
        }, []),
      });
    }
  });
};
