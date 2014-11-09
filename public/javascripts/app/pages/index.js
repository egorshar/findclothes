define('app/pages/index', function (require) {
  'use strict';

  var Page = require('app/pages/page'),
      Template = require('views/index'),
      IndexPage;

  IndexPage = Page.extend({
    template: Template,

    events: {
      'click #search_btn': 'searchSubmit'
    },

    initialize: function () {
      Page.prototype.initialize.call(this);
    },

    searchSubmit: function () {
      var val = this.$('#search').val();

      if (val) {
        FC.router.navigate('/search/' + encodeURIComponent(val), {
          trigger: true
        });
      }
    }
  });

  return IndexPage;
});
