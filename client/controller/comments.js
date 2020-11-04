const commentModel = require("../model/comment");
const striptags = require("striptags");
const { imdbKey } = require('../config/keys')
const imdbAPI = require('imdb-api')
const utilities = require('../libraries/utilities')
const Dictionary = require('../libraries/dictionary')

const Comments = {
  commentAdd: async (content, user, imdb) => {
    try {
      await imdbAPI.get({id:imdb}, {apiKey: imdbKey}).catch((e) => {
        throw new Error(Dictionary().INVALID_MOVIE_ID)
      })
      content = striptags(content);
      if(content.length == 0)
          throw new Error(Dictionary().INVALID_COMMENT)
      const comment = new commentModel({
        user,
        imdb,
        content,
      });
      return comment.save()
      }
    catch (e) {
        console.log(e.message)
        throw new Error(e.message)
    }
  },


  commentView : async (imdb) => {
    let result = await commentModel.find({imdb}).populate('user')
    if(!result || result.length == 0)
       return false
    let comntsByDate = result.sort((a, b) => {
        var dateA = new Date(a.date), dateB = new Date(b.date);
        return -(dateA - dateB);
    })
    result = await utilities.getCommentBody(comntsByDate)
    return result
  }
};

module.exports = Comments;
