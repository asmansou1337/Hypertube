const express = require("express");
const moviesRouter = new express.Router();
const moviesController = require('../controller/movies')

moviesRouter.get('/list/:page', moviesController.listMovies)

moviesRouter.get('/discover/:id', moviesController.discoverMovie)

moviesRouter.get('/watch/:imdb', moviesController.watchMovie)



module.exports = moviesRouter;