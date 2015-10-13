define(function (require) {
  'use strict';

  var _ = require('underscore'),

      rAF =   window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              // IE Fallback, you can even fallback to onscroll
              function(callback) { window.setTimeout(callback, 1000/60) },

      test = document.createElement('DIV'),
      prefixes = 'transform WebkitTransform MozTransform OTransform'.split(' '),
      utils = {},
      cache = {};

  for (var i = 0; i < prefixes.length; i++) {
    if (test.style[prefixes[i]] !== undefined) {
      utils.transform_prop = prefixes[i];
      break;
    }
  }

  if (!utils.transform_prop) {
    return {
      init: function () {},
      destroy: function () {},
    };
  }

  utils.animator = function (factor, max, min, offset) {
    return function (params) {
      var delta = factor*((offset || 0) + params.elemY);

      if (_.isNumber(max) && delta > max) {
        return max;
      }
      if (_.isNumber(min) && delta < min) {
        return min;
      }

      return delta;
    };
  }(-0.4, 150, -30, 50);

  utils.translate3d = function (result) {
    if (!result.x && !result.y) {
      return '';
    }
    return 'translate3d(' + Math.round(result.x) + 'px, ' + Math.round(result.y) + 'px, 0)';
  };

  utils.applyProperties = function (result, element) {
    element.style[utils.transform_prop] = utils.translate3d(result);
  };

  var onScroll = function () {
    var scrollY = window.scrollY,
        rect;

    if (scrollY > utils.container_height) {
      return;
    }

    rect = utils.element.getBoundingClientRect();

    utils.y = utils.animator({
      elemY: rect.top
    });

    if (utils.y !== utils.currentY) {
      utils.applyProperties({
        x: 0,
        y: utils.y
      }, utils.element);

      utils.currentY = utils.y;
    }
  };

  function loop () {
    onScroll();

    if (!utils.is_scrolled) {
      return false;
    }

    rAF(loop);
  };

  function _onScroll () {
    if (!utils.is_scrolled) {
      utils.is_scrolled = true;

      loop();
    }

    clearTimeout(utils.scroll_timeout);

    utils.scroll_timeout = setTimeout(function () {
      utils.is_scrolled = false;
    }, 300);
  };

  function getHeight (el) {
    var styles = window.getComputedStyle(el),
        margin = parseFloat(styles['marginTop']) +
                 parseFloat(styles['marginBottom']);

    return Math.ceil(el.offsetHeight + margin);
  };

  return {
    init: function (element) {
      utils.element = element;
      utils.container_height = getHeight(element.parentNode);

      document.addEventListener('scroll', _onScroll, false);
      document.addEventListener('touchmove', _onScroll, false);
      _onScroll();
    },
    detach: function () {
      document.removeEventListener('scroll', _onScroll, false);
      document.removeEventListener('touchmove', _onScroll, false);
    },
  };
});
