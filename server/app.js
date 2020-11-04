const express = require('express')
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express()
const { uri, options, status } = require("./config/mongoConf");
const maintenance = require('./libraries/maintenance')

 
const movies = require('./routes/movies')
const captions = require('./routes/captions')


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

maintenance.deleteUnwatched()

app.use(morgan('dev'))
mongoose.connect(uri,options,status);


app.use('/movies', movies)
app.use('/captions', captions)

app.listen(3000, () =>{
    console.log('Api Listening on Port 3000')
})