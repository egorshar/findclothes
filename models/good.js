var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeCache = require("node-cache");
var count_cache = new NodeCache();

var Brand = require('./brand');
var Currency = require('./currency');
var Size = require('./size');
var Store = require('./store');

var GoodSchema = new Schema ({
  url: String,
  name: String,
  brand: { type: Schema.ObjectId, ref: 'Brand' },
  mod: String,
  img: String,
  price: Number,
  price_no_vat: Number,
  currency: { type: Schema.ObjectId, ref: 'Currency' },
  sizes: [{ type: Schema.ObjectId, ref: 'Size' }],
  store: {type: Schema.ObjectId, ref: 'Store' },
});

mongoose.model('Good', GoodSchema, 'goods');

module.exports = {
  model: mongoose.model('Good'),

  random: function () {
    var _this = this,
        model = this.model,
        promise = new mongoose.Promise(),
        per_page = 12,
        stores_ids = [],
        find_promise;

    Store.getActive().then(function (stores) {
      if (stores.length) {
        stores_ids = _.map(stores, function (store) {
          return store._id;
        });

        count_cache.get('goods_count', function (err, value) {
          if (!err && value) {
            _this.findByStores(
              stores_ids,
              Math.floor(Math.random() * (value - per_page)),
              per_page
            ).then(function (goods) {
              promise.resolve(null, goods);
            });
          } else {
            model.count()
              .where('store').in(stores_ids)
              .exec()
              .then(function (num) {
                if (num) {
                  _this.findByStores(
                    stores_ids,
                    Math.floor(Math.random() * (num - per_page + 1)),
                    per_page
                  ).then(function (goods) {
                    promise.resolve(null, goods);
                  });
                } else {
                  promise.resolve(null, []);
                }

                // положим количество товаров в кеш
                // на 12 часов
                count_cache.set('goods_count', num, 60*60*12);
              });
          }
        });
      } else {
        promise.resolve(null, []);
      }
    });

    return promise;
  },

  list: function (page) {
    var _this = this,
        model = this.model,
        promise = new mongoose.Promise(),
        per_page = 12;

    page = page || 1;

    Store.getActive().then(function (stores) {
      if (stores.length) {
        _this.findByStores(
          _.map(stores, function (store) {
            return store._id;
          }),
          per_page * (page - 1),
          per_page
        ).then(function (goods) {
          promise.resolve(null, goods);
        });
      } else {
        promise.resolve(null, []);
      }
    });

    return promise;
  },

  findByStores: function (stores_ids, skip, limit) {
    console.log(stores_ids, skip, limit);
    return this.model.find()
      .where('store').in(stores_ids)
      .skip(skip)
      .limit(limit)
      .populate('brand')
      .populate('currency')
      .populate('sizes')
      .populate('store')
      .exec();
  },

  findByName: function (name, mod) {
    var filter = {
      name: name
    };

    if (mod) {
      filter.mod = mod;
    }

    return this.model.find(filter)
            .populate('brand')
            .populate('currency')
            .populate('sizes')
            .exec();
  },

  clean: function (good) {
    return _.reduce(good || {}, function (new_good, value, key) {
      switch (typeof value) {
        case 'string':
          new_good[key] = String.prototype.trim.call(value);
          break;

        default:
          new_good[key] = value;
      }

      return new_good;
    }, {});
  },

  add: function (good) {
    var Good = this.model;
    var promise = new mongoose.Promise();

    good = this.clean(good);

    this.findByName(good.name, good.mod)
      .then(function (goods) {
        if (goods.length) {
          promise.resolve(null, goods[0]._id);
          this.reject();
        }
      })
      // добавим бренд
      .then(function () {
        var brand_add = Brand.add(good.brand)

        brand_add.then(function (brand_id) {
          good.brand = brand_id;
        });

        return;
      })
      // добавим валюту
      .then(function () {
        var currency_add = Currency.add(good.currency);

        currency_add.then(function (currency_id) {
          good.currency = currency_id;
        });

        return currency_add;
      })
      // добавим размеры
      .then(function () {
        var sizes_add = Size.add(good.sizes);

        sizes_add.then(function (sizes_ids) {
          good.sizes = sizes_ids;
        });

        return sizes_add;
      })
      .then(function () {
        Good.collection.insert(good, function (err, result) {
          var good_id = !err ? result.insertedIds.join('') : undefined;

          promise.resolve(null, mongoose.Types.ObjectId(good_id));
        });
      });

    return promise;
  },
};
