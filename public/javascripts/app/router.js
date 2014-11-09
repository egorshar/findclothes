define('app/router', function (require) {
  'use strict';

  var AppRouter,

      $ = require('jquery'),
      Backbone = require('backbone'),

      pages = {};

  pages.IndexPage = require('app/pages/index');
  pages.SearchPage = require('app/pages/search');

  AppRouter = Backbone.Router.extend({
    routes: {
      'search/*query': 'defaultRoute',
      '*index': 'index'
    },

    index: function () {
      new pages['IndexPage']();
    },

    notFound: function () {
      console.log('not found');
    },

    defaultRoute: function () {
      var page = this.current().split('/')[0],
          page_handler = (page && page.charAt(0).toUpperCase() + page.slice(1) + 'Page') || false;

      // init page handler
      if (page_handler) {
        new pages[page_handler]();
      } else {
        this.notFound();
      }
    },

    current: function () {
      if (Backbone.History.started) {
        var router = this,
            // Get current fragment from Backbone.History
            fragment = Backbone.history.fragment,
            // Get current object of routes and convert to array-pairs
            routes = _.pairs(router.routes);

        // Loop through array pairs and return
        // array on first truthful match.
        var matched = _.find(routes, function(handler) {
          var route = handler[0];

          // Convert the route to RegExp using the
          // Backbone Router's internal convert
          // function (if it already isn't a RegExp)
          route = _.isRegExp(route) ? route :  router._routeToRegExp(route);

          // Test the regexp against the current fragment
          return route.test(fragment);
        });

        // Returns callback name or false if
        // no matches are found
        return matched ? matched[0] : '';
      } else {
        // Just return current hash fragment in History
        return Backbone.history.fragment
      }
    }
  });

  return AppRouter;
});
