module.exports = function () {
  var _this = this;

  return this.crawl("http://thehipstore.co.uk/collections/all/", {
    itemMatch: /products\//i,
    discoverRegex: [
      /(\shref\s?=\s?)[\"](.+(products\/)[^\"]+)/gi
    ],
    onFetch: function (url, $) {
      var product = $('#product-select option[selected]').text().split(' / '),
          mod_price = product[1].split(' - ');

      this.emit('good_fetched', {
        url: url,
        brand: $('.grid__item.three-quarters.portable-one-whole > p.half-bottom:first').text(),
        name: $.trim($('h1.half-bottom').text()),
        mod: mod_price[0],
        img: $(".product--image-pop img").attr('src'),
        price: _this.parsePrice(mod_price[1]),
        currency: $('#currency-select option[selected]').val(),
        sizes: $.makeArray(
          $('#product-select option').map(function () {
            return $(this).text().split(' ')[0];
          })
        ),
      });
    }
  });
};
