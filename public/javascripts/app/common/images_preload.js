define(function () {
  'use strict';

  var images_preload = {};

  var callback = function () {};

  var offset, poll, delay, useDebounce, unload;

  var isHidden = function (element) {
    return (element.offsetParent === null);
  };

  var inView = function (element, view) {
    if (isHidden(element)) {
      return false;
    }

    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  var debounceOrThrottle = function () {
    if (!useDebounce && !!poll) {
      return;
    }

    clearTimeout(poll);
    poll = setTimeout(function(){
      images_preload.render();
      poll = null;
    }, delay);
  };

  images_preload.init = function (opts) {
    opts = opts || {};

    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;

    var optionToInt = function (opt, fallback) {
      return parseInt(opt || fallback, 10);
    };

    offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };

    delay = optionToInt(opts.throttle, 250);
    useDebounce = opts.debounce !== false;
    callback = opts.callback || callback;

    images_preload.render();

    window.addEventListener('scroll', debounceOrThrottle, false);
    window.addEventListener('load', debounceOrThrottle, false);
  };

  images_preload.render = function () {
    var nodes = document.querySelectorAll('img[data-img], [data-background]');
    var length = nodes.length;
    var src, elem, preload_img = document.createElement('IMG');

    var view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (window.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (window.innerWidth || document.documentElement.clientWidth) + offset.r
    };

    for (var i = 0; i < length; i++) {
      elem = nodes[i];

      if (inView(elem, view)) {
        preload_img.src = elem.getAttribute('data-background');

        preload_img.onload = images_preload.loaded(elem);
      }
    }
  };

  images_preload.loaded = function (elem) {
    if (elem.getAttribute('data-background') !== null) {
      elem.style.backgroundImage = "url(" + elem.getAttribute('data-background') + ")";
    } else {
      elem.src = elem.getAttribute('data-echo');
    }

    elem.removeAttribute('data-background');

    callback(elem);
  };

  images_preload.detach = function () {
    window.removeEventListener('scroll', debounceOrThrottle);

    clearTimeout(poll);
  };

  return images_preload;
});
