define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
      helpers = require('app/helpers'),
      Page;

  Page = Backbone.View.extend({
    events: {
      'click a': 'linkTo'
    },

    initialize: function () {
      this.setElement($('#page'));
      helpers.retinaImages();
    },

    destroy: function () {
      this.remove();
    },

    linkTo: function (e) {
      var $this = $(e.currentTarget);

      if ($this.attr('target') != '_blank') {
        WNT.navigate($this.attr('href'), {
          trigger: true
        });

        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  return Page;
});
