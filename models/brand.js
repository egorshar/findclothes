var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BrandSchema = new Schema({
  name: String,
  logo: String,
});

mongoose.model('Brand', BrandSchema, 'brands');

module.exports = {
  model: mongoose.model('Brand'),

  findByName: function (name) {
    return this.model.findOne({ name: name }).exec();
  },

  add: function (name) {
    var Brand = this.model,
        promise = new mongoose.Promise();

    if (!name) {
      return promise.resolve();
    }

    this.findByName(name)
      .then(function (brand) {
        if (brand) {
          promise.resolve(null, brand._id);
          return;
        }

        Brand.collection.insert({
          name: String.prototype.trim.call(name)
        }, function (err, result) {
          var brand_id = !err ? result.insertedIds.join('') : undefined;

          promise.resolve(null, mongoose.Types.ObjectId(brand_id));
        });
      });

    return promise;
  },
};
