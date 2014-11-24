define('app/engines/end', function (require) {
  'use strict';

  var Engine = require('app/engine'),
      End,

  End = Engine.extend({
    url: 'http://www.endclothing.co.uk/catalogsearch/result/?q=#QUERY#&x=0&y=0',
    name: 'Endclothing',

    parse: function ($body) {
      var items = $body.find('.category-products.catalog-listing .thumbnail.item').each(_.bind(function (key, item) {
        var $item = $(item),
            price = $item.find('.price-box .price').text() || '';

        this.results.push({
          detail_page: $item.find('.product-image').attr('href'),
          photo: $item.find('.product-image img').attr('src'),
          name: $item.find('h3 a').text() + ' (' +$item.find('h4').text() + ')',
          price: price.replace(/[^\d\.]/gi, ''),
          currency: this.parseCurrency(price.replace(/[\d\.]/gi, ''))
        });
      }, this));
    }
  });

  return End;
});
