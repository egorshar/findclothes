var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CurrencySchema = new Schema({
  label: String,
  rate: Number,
  description: String,
});

mongoose.model('Currency', CurrencySchema, 'currencies');

module.exports = {
  model: mongoose.model('Currency'),

  findByLabel: function (label) {
    return this.model.findOne({ label: label }).exec();
  },

  add: function (label) {
    var Currency = this.model,
        promise = new mongoose.Promise();

    if (!label) {
      return promise.resolve();
    }

    this.findByLabel(label)
      .then(function (currency) {
        if (currency) {
          promise.resolve(null, currency._id);
          return;
        }

        Currency.collection.insert({
          label: String.prototype.trim.call(label)
        }, function (err, result) {
          var currency_id = !err ? result.insertedIds.join('') : undefined;

          promise.resolve(null, mongoose.Types.ObjectId(currency_id));
        });
      });

    return promise;
  },
};
