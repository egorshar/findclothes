define(function (require) {
  var rAF =   window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              // IE Fallback, you can even fallback to onscroll
              function(callback) { window.setTimeout(callback, 1000/60) },

      is_scrolled = false,
      is_sticked = false,
      el,
      el_top,
      scroll_timeout,
      stick = function() {},
      unstick = function () {};

  function init (options) {
    options = options || {};

    if (!options.el) {
      throw new Error('Sticky element must be presented in options');
    }

    el = options.el;
    el_top = options.el.offsetTop;

    if (options.stick) {
      stick = options.stick;
    }
    if (options.unstick) {
      unstick = options.unstick;
    }

    window.addEventListener('scroll', _onScroll);
  };

  function detach () {
    window.removeEventListener('scroll', _onScroll);
  };

  function _onScroll () {
    if (!is_scrolled) {
      is_scrolled = true;

      loop();
    }

    clearTimeout(scroll_timeout);

    scroll_timeout = setTimeout(function () {
      is_scrolled = false;
    }, 300);
  };

  function loop () {
    var top = window.pageYOffset;

    if (top >= el_top) {
      if (!is_sticked) {
        is_sticked = true;
        el.classList.add('sticky');
        stick();
      }
    } else {
      if (is_sticked) {
        is_sticked = false;
        el.classList.remove('sticky');
        unstick();
      }
    }

    // Recall the loop
    if (!is_scrolled) {
      return false;
    }

    rAF(loop);
  };

  return {
    init: init,
    detach: detach,
  };
});
