define(function (require) {
  'use strict';

  var AppRouter,

      $ = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone'),
      salvattore = require('salvattore'),

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

    defaultRoute: function () {
      var page = this.current().split('/')[0],
          page_handler = (page && page.charAt(0).toUpperCase() + page.slice(1) + 'Page') || false,
          construct = function (constructor, args) {
            function F() {
              return constructor.apply(this, args);
            }

            F.prototype = constructor.prototype;
            return new F();
          };

      // init page handler
      if (page_handler) {
        this.page = construct(pages[page_handler], arguments);
      } else {
        this.notFound();
      }
    },
  });

  return AppRouter;
});
