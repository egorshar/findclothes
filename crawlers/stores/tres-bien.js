module.exports = function () {
  var _this = this;

  return this.crawl("http://tres-bien.com/categories/", {
    itemMatch: /tres\-bien\.com\/[\w\d\-]+\/[\w\d\-]+/i,
    discoverRegex: [
      /href=\"(\/[\w\d\-]+\/[\w\d\-]+)\"/gi,
      /href=\".+\/categories\?p\=\d{1,}\"/gi
    ],
    onFetch: function (url, $) {
      this.emit('good_fetched', {
        url: url,
        brand: $.trim($('.product-info-container h2').text()),
        name: $.trim($('.product-info-container h1').text()),
        mod: $.trim($('.product-info-container .product-short-desc li:first span').text()),
        img: $(".product-image img[rel=\"productPhoto\"]:first").attr('src'),
        price: _this.parsePrice($('.product-info-container .regular-price').text()),
        currency: 'EUR',
        sizes: _this.getSPConfigSizes($('.product-info-container').html()),
      });
    }
  });
};
