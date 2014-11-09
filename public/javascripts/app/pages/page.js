define('app/pages/page', function (require) {
  'use strict';

  var Backbone = require('backbone'),
      Page;

  Page = Backbone.View.extend({
    first_load: false,

    initialize: function () {
      this.setElement($('#page'));
      this.firstLoad();
    },

    destroy: function () {
      this.$el.off();
    },

    firstLoad: function () {
      var from_server = this.$el.attr('data-server');

      if (from_server) {
        this.first_load = true;
        this.$el.removeAttr('data-server');
      }

      return this.first_load;
    }
  });

  return Page;
});
