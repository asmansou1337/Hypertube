const mongoose = require('mongoose');

const Schema = mongoose.Schema

const commentSchema =  new Schema({
    imdb: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    content: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('comment', commentSchema);