define(function (require) {
  'use strict';

  var AppRouter,

      $ = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone'),

      pages = {};

  pages.IndexPage = require('app/pages/index');
  pages.SearchPage = require('app/pages/search');

  AppRouter = Backbone.Router.extend({
    routes: {
      'search/*query': 'defaultRoute',
      '*index': 'index'
    },

    execute: function (callback, args) {
      // destroy old page before init new one
      if (this.page) {
        this.page.destroy();
      }

      if (callback) callback.apply(this, args);
    },

    index: function () {
      this.page = new pages['IndexPage']();
    },

    notFound: function () {
      console.log('not found');
    },
  });

  return AppRouter;
});
