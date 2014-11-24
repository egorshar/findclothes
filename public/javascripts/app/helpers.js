define('app/helpers', function (require) {
  'use strict';

  var $ = require('jquery'),
      helpers = {};

  jQuery.fn.prepareTransition = function () {
    this[0].style.opacity = 0;
    window.getComputedStyle(this[0]).opacity;
    this[0].style.opacity = '';

    return this;
  };

  return helpers;
});
