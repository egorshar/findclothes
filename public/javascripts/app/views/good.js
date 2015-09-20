define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
      template = require('views/blocks/good');

  return Backbone.View.extend({
    template: template,

    render: function () {
      var $el = this.template({
        good: this.model.toJSON(),
      });

      this.setElement($el);

      return this;
    },
  });
});
