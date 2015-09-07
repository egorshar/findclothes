var _ = require('underscore');
var requireDir = require('require-dir');

var mongoose = require('mongoose');
var Good = require('../models/good');
var Store = require('../models/store');

// var stores = [require('./stores/peggsandson')];
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

  mongoose.connect(process.env.MONGOLAB_URI);

  mongoose.connection.once('open', function () {
    this._db = true;

    callback();
  });
};

// дисконнект
StoreCrawler.prototype.disconnect = function () {
  mongoose.connection.close();
};

StoreCrawler.prototype.crawlStore = function () {
  var stores_names = Object.keys(stores),
      store;

  // проверим, остались ли еще пауки вообще
  if (stores[stores_names[0]]) {
    this.store = stores[stores_names[0]].call(helpers);

    Store.add(this.store.data)
      .then(_.bind(function (store_id) {
        this.store._id = store_id;

        return Store.disable(this.store.data.name);
      }, this))
      .then(_.bind(function () {
        return Store.removeGoods(this.store._id);
      }, this))
      .then(_.bind(function () {
        this.store.crawler()
          .on('complete', _.bind(this.crawlComplete, this))
          .on('good_fetched', _.bind(this.addGood, this));
      }, this));

    delete stores[stores_names[0]];
  } else {
    this.store = null;
    this.disconnect();

    console.log('All stores crawlered');
  }
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
