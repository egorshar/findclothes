define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
      GoodModel = require('app/models/good');

  return Backbone.Collection.extend({
    model: GoodModel,
    url: '/find',
  });
});
