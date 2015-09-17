var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Good = require('./good');

var StoreSchema = new Schema({
  name: String,
  url: String,
  logo: String,
  active: { type: Boolean, default: false },
});

mongoose.model('Store', StoreSchema, 'stores');

module.exports = {
  model: mongoose.model('Store'),

  getActive: function () {
    return this.model.find({})
      .where('active').equals(true)
      .exec();
  },

  findByName: function (name) {
    return this.model.findOne({ name: name }).exec();
  },

  add: function (store) {
    var Store = this.model,
        promise = new mongoose.Promise();

    if (!store) {
      return promise.resolve();
    }

    this.findByName(store.name)
      .then(function (store_exists) {
        if (store_exists) {
          promise.resolve(null, store_exists._id);
          return;
        }

        Store.collection.insert(store, function (err, result) {
          var store_id = !err ? result.insertedIds.join('') : undefined;

          promise.resolve(null, mongoose.Types.ObjectId(store_id));
        });
      });

    return promise;
  },

  disable: function (name) {
    return this.model.update({name: name}, {
      active: false
    }).exec();
  },

  enable: function (name) {
    return this.model.update({name: name}, {
      active: true
    }).exec();
  },

  removeGoods: function (store_id) {
    return Good.model.remove({store: store_id}).exec();
  },
};
