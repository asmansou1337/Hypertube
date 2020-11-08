const express = require("express");
const captionsRouter = new express.Router();
const captionsController = require('../controller/captions')
const utilities = require('../libraries/utilities')

//http://localhost:3000/v1/captions/tt1156398?lang=fr
captionsRouter.get('/:id', async (req ,res) => {
    try{
        const captions = await captionsController.findCaptions(req.params.id)
        if(!captions)
            return res.status(404).send({Message: "Captions not found"})
        const captionFile = await utilities.findRquestedLang(captions, req.query.lang)
        if(!captionFile)
            return res.status(404).send({Message: "Captions for desired langage not found"})
        setTimeout(() => {
            return res.status(200).sendFile(`${req.params.id}.vtt`, {"root": `./movies/vtt/${req.params.id}/${req.query.lang}/`}) 
        }, 5000)
    }
    catch(e) {
        console.log(e.message)
        res.status(404).send({error: e.message})
    }
})


module.exports = captionsRouter