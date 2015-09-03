define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
      _ = require('underscore'),
      Engine;

  /**
  * Model Structure
  * {
  *   detail_page: String,
  *   photo: String,
  *   name: String,
  *   price: Float,
  *   currency: String
  * }
  */

  Engine = Backbone.Model.extend({
    initialize: function (params) {
      params = params || {};
      if (!params.query) {
        return;
      }

      this.results = params.results;
      this.url = '/fetch?page=' + encodeURIComponent(this.url.replace('#QUERY#', params.query));

      this.fetch();
    },

    sync: function (method) {
      switch (method) {
        case 'read':
            this.xhr = $.ajax({
              url: this.url
            });

            this.xhr.done(_.bind(this.fetchSuccess, this));
            this.xhr.fail(_.bind(this.fetchError, this));
          break;

        default: return;
      }
    },

    fetchSuccess: function (resp) {
      if (!_.isFunction(this.parse)) {
        return;
      }
      this.parse($('<div></div>').append(resp));
    },

    fetchError: function () {},

    parseCurrency: function (currency) {
      return currency;
    }
  });

  return Engine;
});
