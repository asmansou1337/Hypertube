const express = require("express");
const commentsRouter = new express.Router();
const commentsController = require("../controller/comments");
const Dictionary = require('../libraries/dictionary')
const verifyAuth = require('../middlewares/auth')
const utilities = require('../libraries/utilities')
const checkUrl = require('../helpers/checkUrl');

// Add New comment
commentsRouter.post("/add", verifyAuth, async (req, res) => {
  try {
    if(!req.user)
      throw new Error(Dictionary().SOMETHING_WENT_WRONG)

    let { _id, username, profileImg } = req.user;
    const { content, date } = await commentsController.commentAdd(
      req.body.comment,
      _id,
      req.query.imdb
    );
    if(!checkUrl(profileImg)){
      profileImg = '/images/'+ profileImg
    } 
    return res.send({ username, profileImg, content, date: utilities.formatDate(date) });
  } catch (e) {
    return res.send({error: e.message});
  }
});

// Get Comment list for a movie
commentsRouter.get('/view/:imdb', async (req, res) => {
    try {
      const result = await commentsController.commentView(req.params.imdb);
      if(!result)
          return res.send({Message: Dictionary().NO_COMMENT});
      return res.send(result);
      } catch (e) {
        console.log(e.message);
        return  res.send({error: Dictionary().SWWPTA});
      }
})

module.exports = commentsRouter;
