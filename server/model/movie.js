const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const movieSchema = new Schema({
    imdbCode: String,
    WatchedOn: {
        type: Date,
        default: Date.now
    },
    File: String
})
const Movie = mongoose.model('movie', movieSchema)

module.exports = Movie
