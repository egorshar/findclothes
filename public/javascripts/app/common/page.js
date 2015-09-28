define(function (require) {
  'use strict';

  var Backbone = require('backbone'),
      h = require('app/helpers'),
      Page;

  Page = Backbone.View.extend({
    events: {
      'click a': 'linkTo'
    },

    initialize: function () {
      this.setElement($('#page'));
      h.retinaImages();
    },

    destroy: function () {
      this.remove();
    },

    linkTo: function (e) {
      var $this = $(e.currentTarget);

      if ($this.attr('target') != '_blank') {
        WNT.navigate($this.attr('href'), {
          trigger: true
        });

        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  ;(function (window, document) {
    var is_disabled = false,
        timer;

    function disableHover() {
      if (!is_disabled) {
        document.body.classList.add('disable-hover');
        is_disabled = true;
      }
    }

    function enableHover() {
      if (is_disabled) {
        document.body.classList.remove('disable-hover');
        is_disabled = false;
      }
    }

    window.addEventListener('scroll', function (e) {
      if (document.activeElement !== document.body) {
        return;
      }

      clearTimeout(timer);
      disableHover();

      timer = setTimeout(enableHover, 300);
    }, false);
  }(window, document));

  return Page;
});
