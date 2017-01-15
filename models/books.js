var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
  title: String,
  author: String,
  user: String
});

module.exports = mongoose.model('Book', Book);