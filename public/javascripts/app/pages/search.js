define(function (require) {
  'use strict';

	var Page = require('app/common/page'),
      Index = require('app/pages/index'),
      template = require('views/partials/search'),

      _ = require('underscore'),
      h = require('app/helpers'),

      SearchPage;

  SearchPage = Index.extend({
    template: template,

    events: function() {
      return _.extend(Index.prototype.events() || {}, {

      });
    },

    initialize: function (query) {
      Page.prototype.initialize.call(this);

      this.listenTo(this.results, 'add', this.addResultItem);
    },
  });

	return SearchPage;
});
