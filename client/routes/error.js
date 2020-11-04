const express = require("express");
const errorRouter = new express.Router();
const Dictionary = require('../libraries/dictionary')


errorRouter.get('/', async (req, res) => {
    return res.render('pages/error', {error: Dictionary().NOT_FOUND, status: '404'})
})


module.exports = errorRouter