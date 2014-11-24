define('app/engines/oipolloi', function (require) {
  var Engine = require('app/engine'),
      site_addr = '//www.oipolloi.com/',
      Oipolloi;

  Oipolloi = Engine.extend({
    url: 'http://www.oipolloi.com/search/#QUERY#',
    name: 'Oipolloi',

    parse: function ($body) {
      var items = $body.find('#section .top').each(_.bind(function (key, item) {
        var $item = $(item);

        this.results.push({
          detail_page: site_addr + $item.find('a').attr('href'),
          photo: site_addr + $item.find('img').attr('src'),
          name: $item.find('h2').text(),
          price: '',
          currency: ''
        });
      }, this));
    }
  });

  return Oipolloi;
});
