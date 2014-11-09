define(function (require) {
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      SearchPage = require('app/pages/search'),
      IndexPage = require('app/pages/index'),
      AppRouter;

  AppRouter = Backbone.Router.extend({
    initialize: function () {
      this.route(/\/?/, 'default', this.defaultRoute);
    },

    routes: {
      'search/*query': 'defaultRoute'
    },

    defaultRoute: function () {
      console.log(arguments);
    },

    index: function () {
      new IndexPage();
    },

    search: function () {
      new SearchPage();
    }
  });

  return AppRouter;
});
