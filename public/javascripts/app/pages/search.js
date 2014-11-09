define('app/pages/search', function (require) {
  'use strict';

	var Page = require('app/pages/page'),
      SearchPage;

  SearchPage = Page.extend({
    initialize: function () {
      console.log('search page inited');
    }
  });

	return SearchPage;
});
