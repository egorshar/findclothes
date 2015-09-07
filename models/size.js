var _ = require('underscore');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SizeSchema = new Schema({
  label: String,
});

mongoose.model('Size', SizeSchema, 'sizes');

module.exports = {
  model: mongoose.model('Size'),

  findByLabel: function (label) {
    return this.model.findOne({ label: label }).exec();
  },

  add: function (labels) {

    var Size = this.model,
        promise = new mongoose.Promise(),
        size_ids = [];

    if (!_.isArray(labels)) {
      labels = [labels];
    }

    if (!labels.length) {
      promise.resolve(null, []);
    }

    _.each(labels, function (label) {
      this.findByLabel(label)
        .then(function (size) {
          if (size) {
            size_ids = size_ids.concat([size._id]);

            if (labels.length == size_ids.length) {
              promise.resolve(null, size_ids);
            }
            return;
          }

          Size.collection.insert({
            label: String.prototype.trim.call(label)
          }, function (err, result) {
            var size_id = !err ? result.insertedIds.join('') : undefined;
            size_ids = size_ids.concat([mongoose.Types.ObjectId(size_id)]);

            if (labels.length == size_ids.length) {
              promise.resolve(null, size_ids);
            }
          });
        });
    }, this);

    return promise;
  },
};
