define(function (require) {
  'use strict';

  var $ = require('jquery'),
      helpers = {};

  jQuery.fn.prepareTransition = function () {
    this[0].style.opacity = 0;
    window.getComputedStyle(this[0]).opacity;
    this[0].style.opacity = '';

    return this;
  };

  helpers.retinaImages = function () {
    var img_to_replace, i, l;

    if ('devicePixelRatio' in window && window.devicePixelRatio == 2) {
      img_to_replace = $('img[data-2x]').get();
      l = img_to_replace.length;

      for (i = 0; i < l; i++) {
        img_to_replace[i].src = img_to_replace[i].getAttribute('data-2x');
      };
    }
  };

  return helpers;
});
