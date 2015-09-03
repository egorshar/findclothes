define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
      Page;

  Page = Backbone.View.extend({
    first_load: false,

    events: {
      'click a': 'linkTo'
    },

    initialize: function () {
      this.setElement($('#page'));
      this.firstLoad();
    },

    destroy: function () {
      this.undelegateEvents();
      this.$el.off();
    },

    firstLoad: function () {
      var from_server = this.$el.attr('data-server');

      if (from_server) {
        this.first_load = true;
        this.$el.removeAttr('data-server');
      }

      return this.first_load;
    },

    linkTo: function (e) {
      var $this = $(e.currentTarget);

      if ($this.attr('target') != '_blank') {
        FC.router.navigate($this.attr('href'), {
          trigger: true
        });

        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  return Page;
});
