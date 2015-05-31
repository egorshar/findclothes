var _ = require('underscore'),
    jsdom = require("jsdom");

module.exports = {
  fetchPage: function (buffer, callback, context) {
    jsdom.env({
      html: buffer,
      scripts: ["http://code.jquery.com/jquery.js"],
      done: _.bind(callback, context || this)
    });
  }
};
