var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Conversation = new Schema({
  title: String,
  users: String,
  text: String
});

module.exports = mongoose.model('Conversation', Conversation);