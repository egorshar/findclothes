define(function (require) {
  'use strict';

  var salvattore = require('salvattore'),
      Steady = require('steady'),
      echo = require('echojs'),
      Layzr = require('layzr'),

      template = require('views/partials/index'),
      Page = require('app/common/page'),
      GoodsCollection = require('app/collections/goods'),
      Good = require('app/views/good'),

      IndexPage;

  IndexPage = Page.extend({
    template: template,
    page: 0,

    _selectors: {
      goods: '#goods',
      more: '.goods-loader__btn',
      caption: '.goods-container__caption',
    },

    events: function() {
      return _.extend({}, Page.prototype.events || {}, {
        'submit form': 'preventSubmit',
        'click .goods-loader__btn': 'moreClick',
      });
    },

    initialize: function () {
      Page.prototype.initialize.call(this);

      this.goods_container = document.getElementById('goods');

      this.goods = new GoodsCollection();
      this.listenTo(this.goods, 'sync', this.appendGoods);

      this.layzr = new Layzr({
        bgAttr: 'data-layzr',
        callback: function () {
          var loader = this.querySelector('.loader');
          loader.parentNode.removeChild(loader);
        }
      });
    },

    destroy: function () {
      if (this.steady) {
        this.steady.stop();
      }

      if (this.layzr) {
        this.layzr.destroy();
      }

      Page.prototype.destroy.apply(this, arguments);
    },

    appendGoods: function (collection, models) {
      var items = _.map(models, function (model) {
        return new Good({
          model: collection.get(model._id),
        }).render().el;
      }, this);

      salvattore.appendElements(this.goods_container, items);

      this.layzr._nodes = document.querySelectorAll(this.layzr._optionsSelector);
      this.layzr.update();
    },

    /* DOM-events */
    preventSubmit: function () {
      return false;
    },

    moreClick: function () {
      this.fetchPage();
    },
    /* end of DOM-events */

    fetchPage: function (values, done) {
      var new_page = this.page + 1;

      if (this._fetching) {
        return;
      }
      this._fetching = true;

      this.goods.fetch({
        data: {page: new_page},
        success: _.bind(function () {
          if (this.page === 0) {
            this.resetGoods();
          }

          this.page++;
          this._fetching = false;
        }, this),
        error: _.bind(function () {
          this._fetching = false;
        }, this),
      });
    },

    // при первой загрузке мы убиваем текущие
    resetGoods: function () {
      $('html, body').animate({
        scrollTop: 0,
      }, 300);

      _.each(this.goods_container.querySelectorAll('a'), function (link) {
        link.parentNode.removeChild(link);
      });

      salvattore.recreateColumns(this.goods_container);
      this.$(this._selectors['caption']).html('Explore');

      this.steady = new Steady({
        conditions: {
          "max-bottom": 200
        },
        throttle: 100,
        handler: _.bind(function (values, done) {
          this.fetchPage();
          done();
        }, this),
      });
    },
  });

  return IndexPage;
});
