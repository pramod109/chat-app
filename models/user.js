const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));
