define('app/pages/index', function (require) {
  'use strict';

  var Page = require('app/pages/page'),
      template = require('views/partials/index'),
      Spinner = require('spinjs'),
      IndexPage;

  IndexPage = Page.extend({
    template: template,

    events: function() {
      return _.extend({}, Page.prototype.events||{}, {
        'click #search_btn': 'searchSubmit',
        'submit form': 'preventSubmit',
        'input #search': 'updateQuery'
      });
    },

    initialize: function () {
      Page.prototype.initialize.call(this);

      if (!this.firstLoad()) {
        this.render();
      }
    },

    render: function () {
      this.$el.html(this.template());
    },

    /* DOM-events */
    updateQuery: function (e) {
      this.query = !e ? this.$('#search').val() : $(e.currentTarget).val();
    },

    searchSubmit: function () {
      var val = this.$('#search').val();

      if (val) {
        this.showSpinner();

        FC.router.navigate('/search/' + encodeURIComponent(val), {
          trigger: FC.router.current().indexOf('search') !== 0 ? true : false
        });
      }

      return this.preventSubmit();
    },

    preventSubmit: function () {
      return false;
    },
    /* end of DOM-events */

    showSpinner: function () {
      var spinner = new Spinner({
        lines: 7, // The number of lines to draw
        length: 0, // The length of each line
        width: 7, // The line thickness
        radius: 8, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
      }).spin(this.$('#search_btn')[0]);
    }
  });

  return IndexPage;
});
