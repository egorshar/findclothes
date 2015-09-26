define(function (require) {
  'use strict';

  var salvattore = require('salvattore'),
      Steady = require('steady'),
      preload = require('app/common/preload'),
      sticky = require('app/common/sticky'),

      template = require('views/partials/index'),
      Page = require('app/common/page'),
      GoodsCollection = require('app/collections/goods'),
      Good = require('app/views/good'),

      $document = $(document),
      sticked = false,
      IndexPage;

  IndexPage = Page.extend({
    template: template,
    page: 0,
    _type: 'index',

    _selectors: {
      goods: '#goods',
      more: '.goods-loader__btn',
      caption: '.goods-container__caption',
      header_bg: '.header__bg',
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
      this.search_block = document.getElementById('search_block');

      this.goods = new GoodsCollection();
      this.listenTo(this.goods, 'sync', this.appendGoods);

      preload.init({
        throttle: 150,
        callback: function (element) {
          var loader = element.querySelector('.loader');

          if (loader) {
            loader.parentNode.removeChild(loader);
          }
        }
      });

      sticky.init({
        el: this.search_block,
        stick: _.bind(function () {
        }, this),
        unstick: _.bind(function () {
        }, this)
      });

      $document.trigger('page:loaded:index');
    },

    destroy: function () {
      $document.triger('page:destroy:index');

      if (this.steady) {
        this.steady.stop();
      }

      preload.detach();
      sticky.detach();

      Page.prototype.destroy.apply(this, arguments);
    },

    appendGoods: function (collection, models) {
      var items = _.map(models, function (model) {
        return new Good({
          model: collection.get(model._id),
        }).render().el;
      }, this);

      salvattore.appendElements(this.goods_container, items);
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
      preloader.render();

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

  // параллакс инициализируем отдельно
  // так как минифицированный он не работает
  // с requirejs
  require([
    'jquery',
    '/javascripts/vendor/scroll-parallax/dist/Parallax.min.js',
  ], function ($, Parallax) {
    var parallax,
        init = function () {
          if (WNT.page._type == 'index') {
            parallax = new Parallax('.header__bg').init();
          }
        };

    $document
      .on('ready page:loaded:index', function (e) {
        init();
      })
      .on('page:destroy:index', function () {
        if (parallax) {
          parallax.destroy();
          parallax = null;
        }
      });

    init();
  });

  return IndexPage;
});
