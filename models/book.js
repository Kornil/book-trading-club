var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
  title: String,
  author: String,
  user: String,
  imageLink: String,
  wantedBy: [],
});

module.exports = mongoose.model('Book', Book);
