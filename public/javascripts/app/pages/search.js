define('app/pages/search', function (require) {
  'use strict';

	var Page = require('app/pages/page'),
      Index = require('app/pages/index'),
      template = require('views/partials/search'),
      SearchResultsItem = require('app/common/search_item'),

      _ = require('underscore'),
      h = require('app/helpers'),

      engines = {},
      SearchPage,
      SearchCollection,
      EnginesCollection;

  engines.End = require('app/engines/end');
  engines.Oipolloi = require('app/engines/oipolloi');

  SearchCollection = Backbone.Collection.extend({
    destroy: function () {

    }
  });

  EnginesCollection = Backbone.Collection.extend({
    destroy: function () {
      this.each(function (model) {
        if (model.xhr && (model.xhr.readyState != 4)) {
          model.xhr.abort();
        }
      });
    }
  });

  SearchPage = Index.extend({
    template: template,

    events: function() {
      return _.extend({}, Index.prototype.events()||{}, {

      });
    },

    initialize: function (query) {
      Page.prototype.initialize.call(this);

      this.updateQuery();
      this.results = new SearchCollection();
      this.engines = new EnginesCollection();
      this.render();

      this.listenTo(this.results, 'add', this.addResultItem);
    },

    destroy: function () {
      this.results.destroy();
      this.engines.destroy();

      Index.prototype.destroy.call(this);
    },

    render: function () {
      var $search_block = this.$('#search_block'),
          $page = $('<div></div>').append(this.template({

          }));

      this.$search_results = $page.find('#search_results');

      if ($search_block.length) {
        $search_block.append($page.find('#search_results_wrapper'))
          .prepareTransition()
          .addClass('search-block-active');
      } else {
        this.$el.html($page);
      }

      this.startEngines();
    },

    startEngines: function () {
      _.each(engines, function (Engine) {
        this.engines.push(new Engine({
          query: this.query,
          results: this.results
        }));
      }, this);
    },

    addResultItem: function (model) {
      var view = new SearchResultsItem({
        model: model
      });

      this.$search_results.append(view.el);
    }
  });

	return SearchPage;
});
