define('app/pages/index', function (require) {
  'use strict';

  var Page = require('app/pages/page'),
      Template = require('views/index'),
      IndexPage;

  IndexPage = Page.extend({
    template: Template,

    initialize: function () {
      console.log(Template);
    }
  });

  return IndexPage;
});
