define('app/pages/index', function (require) {
  'use strict';

  var Page = require('app/pages/page'),
      template = require('views/partials/index'),
      Ladda = require('ladda'),
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
        this.showBtnLoader();

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

    showBtnLoader: function () {
      this.btn_loader = Ladda.create(this.$('#search_btn')[0]);
      this.btn_loader.start();
// // Start loading
// l.start();

// // Will display a progress bar for 50% of the button width
// l.setProgress( 0.5 );

// // Stop loading
// l.stop();

// // Toggle between loading/not loading states
// l.toggle();

// // Check the current state
// l.isLoading();

// // Delete the button's ladda instance
// l.remove();
//       Ladda.bind('#search_btn', {
//         callback: function (instance) {
//           console.log(instance);
//         }
//       });
    }
  });

  return IndexPage;
});
