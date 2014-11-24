define('app/common/search_item', function ($) {
  var Backbone = require('backbone'),
      $ = require('jquery'),
      template = require('views/blocks/result_item'),
      SearchItem;

  SearchItem = Backbone.View.extend({
    template: template,

    initialize: function () {
      this.render();
    },

    render: function () {
      this.setElement($(template(this.model.toJSON())));
    }
  });

  return SearchItem;
});
