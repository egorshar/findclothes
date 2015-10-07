var _ = require('underscore');
var requireDir = require('require-dir');

var mongoose = require('mongoose');
var Good = require('../models/good');
var Store = require('../models/store');

// var stores = [require('./stores/cultizm')];
var stores = requireDir('./stores');
var helpers = require('./helpers');

var StoreCrawler = function () {
  this.connect(_.bind(this.crawlStore, this));
};

// подключение к БД
StoreCrawler.prototype.connect = function (callback) {
  if (mongoose.connection._hasOpened) {
    callback();
    return;
  }

  mongoose.connect(process.env.MONGO_URI);

  mongoose.connection.once('open', function () {
    this._db = true;

    callback();
  });
};

// дисконнект
StoreCrawler.prototype.disconnect = function () {
  mongoose.connection.close();
  process.exit();
};

StoreCrawler.prototype.crawlStore = function () {
  var stores_names = Object.keys(stores),
      store;

  // проверим, остались ли еще пауки вообще
  if (stores[stores_names[0]]) {
    this.store = stores[stores_names[0]].call(helpers);

    Store.add(this.store.data)
      .then(_.bind(function (store) {
        this.store._id = store._id;

        // если последний раз запускали раньше,
        // чем 5 дней назад, то пока не индексируем
        if (store.last_sync && ((Date.now() - store.last_sync) < 1000*60*60*24*5)) {
          this.crawlStore();
          return;
        }

        return Store.disable(this.store.data.name);
      }, this))
      .then(_.bind(function () {
        return Store.removeGoods(this.store._id);
      }, this))
      .then(
        _.bind(this.itemsRemoved, this),
        _.bind(this.itemsRemoved, this)
      );

    delete stores[stores_names[0]];
  } else {
    console.log('All stores crawlered');

    this.store = null;
    this.disconnect();
  }
};

StoreCrawler.prototype.itemsRemoved = function () {
  this.store.crawler()
    .on('complete', _.bind(this.crawlComplete, this))
    .on('good_fetched', _.bind(this.addGood, this));
};

StoreCrawler.prototype.crawlComplete = function () {
  Store.enable(this.store.data.name)
    .then(_.bind(this.crawlStore, this));
};

StoreCrawler.prototype.addGood = function (good) {
  if (this.store && this.store._id) {
    Good.add(_.extend({
      store: this.store._id
    }, good));
  }
};

module.exports = function () {
  return new StoreCrawler();
};
