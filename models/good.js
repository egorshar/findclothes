var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

  list: function (page) {
    var model = this.model,
        promise = new mongoose.Promise(),
        per_page = 12;

    page = page || 1;

    Store.getActive().then(function (stores) {
      if (stores.length) {
        model.find()
          .where('store').in(_.map(stores, function (store) {
            return store._id;
          }))
          .skip(per_page * (page - 1))
          .limit(per_page)
          .populate('brand')
          .populate('currency')
          .populate('sizes')
          .populate('store')
          .exec()
          .then(function (goods) {
            promise.resolve(null, goods);
          });
      } else {
        promise.resolve(null, []);
      }
    });

    return promise;
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
