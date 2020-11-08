const userModel = require("../model/user")
const { imdbKey } = require('../config/keys')
const imdbAPI = require('imdb-api')
const imdbClient = new imdbAPI.Client({apiKey: imdbKey});
const axios = require("axios");
const conf = require("../config/apiConf")
const api = `http://${conf.apiIP}:${conf.apiPort}`
const Dictionary = require('../libraries/dictionary');


const Movies = {

    movieDiscover: async (id) => {
        try {
            const response = await axios.get(
                `${api}/movies/discover/${id}`,
                );
            if (response.data.movie === undefined)
                throw new Error(Dictionary().SWWPTA)
            return response.data.movie;
        } catch (e) {
            if(e.response && e.response.status == 404) {
                throw new Error(Dictionary().INVALID_MOVIE)
            }
            throw new Error(Dictionary().SWWPTA)
        }
    },

    // moviePlay: async (id, hash) => {
    //     try {
    //         return await axios.get(
    //             `${api}/movies/watch/${id}?hash=${hash}`,
    //             );
    //         // return play;
    //     } catch (e) {
    //         console.log(e.message)
    //         throw new Error(Dictionary().SWWPTA)
    //     }
    // },

    //http://localhost:3000/captions/tt1156398?lang=fr
    movieCaptions: async (id, lang) => {
        try {
            const captions = await axios.get(
                `${api}/captions/${id}?lang=${lang}`,
                );
            // console.log(captions.data)
            return captions.data;
        } catch (e) {
            if (e.response.status == 404) {
                // will not show it to the user
                throw new Error(e.response.data.error)
            }
            // console.log(e.response.data)
            throw new Error(Dictionary().CAPTION_FAILED)
        }
    },

    movieList: async (page, params) => {
        try {
            const response = await axios.get(
                `${api}/movies/list/${page}`,
                {params}
              );
            if (response.data.movies == undefined)
                throw new Error(Dictionary().SWWPTA)
            return response.data;
        } catch (e) {
            if (e.response) {
                if (e.response.status === 404) throw new Error(Dictionary().NO_MOVIES)
            }
            console.log(e.message)
            throw new Error(Dictionary().SWWPTA)
        }
        
    },

    movieAddToWatchList : async (imdb, _id) => {
        try{
            isFound = await imdbAPI.get({id:imdb}, {apiKey: imdbKey})
            if(!isFound)
                throw new Error(Dictionary().INVALID_MOVIE_ID)
            /// TO DO : should validate ID before
              const inWatchlist = await userModel.find({_id, watchlist:imdb }).countDocuments()
              let add
              if (inWatchlist > 0) {
                  add = await userModel.findByIdAndUpdate({_id}, {$pull:{watchlist: imdb}})
                  if(!add)
                      throw new Error(Dictionary().SWWPTA)
                  return {Message: Dictionary().RFW, add: 0}
              }
              else {
                  add = await userModel.findByIdAndUpdate({_id}, {$push: { watchlist: imdb }})
                  if(!add)
                      throw new Error(Dictionary().SWWPTA)
                  return {Message: Dictionary().ATW, add: 1}
              }
        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    movieAddToFavorites : async (imdb, _id) => {
        try{
            isFound = await imdbAPI.get({id:imdb}, {apiKey: imdbKey})
            if(!isFound)
                throw new Error(Dictionary().INVALID_MOVIE_ID)
             /// TO DO : should validate ID before
            
            const inFavorites = await userModel.find({_id, favorites:imdb }).countDocuments()
            let add
            if (inFavorites > 0) {
                add = await userModel.findByIdAndUpdate({_id}, {$pull:{favorites: imdb}})
                if(!add)
                    throw new Error(Dictionary().SWWPTA)
                return {Message: Dictionary().RFF, add: 0}
            }
            else {
                add = await userModel.findByIdAndUpdate({_id}, {$push: { favorites: imdb }})
                if(!add)
                    throw new Error(Dictionary().SWWPTA)
                return {Message: Dictionary().ATF, add: 1}
            }
        }
        catch (e) {
            throw new Error(e.message)
        }
    },
    movieAddToWatched : async (imdb, _id) => {
        try{
            isFound = await imdbAPI.get({id:imdb}, {apiKey: imdbKey})
            if(!isFound)
                throw new Error(Dictionary().INVALID_MOVIE_ID)

            /// TO DO : should validate ID before 
            const user = await userModel.findByIdAndUpdate({_id}, {
                $addToSet: { watched: imdb }
              })
            if(!user)
              throw new Error(Dictionary().SWWPTA)
              return {Message: Dictionary().SAW}
        }
        catch (e) {
            throw new Error(e.message)
        }
    },

    watchedList : async (id) => {
        let result = await userModel.findOne({_id:id})
        if(!result || result.length == 0)
           throw new Error(Dictionary().SWWPTA)
        return result.watched
    },

    movieInfoByIds : async (movies) => {
        const results = []
        for (let i = 0; i < movies.length; i++) {
            const movie = await imdbClient.get({id: movies[i]})
            results.push(movie)
        }
        return results
    },
 
}

module.exports = Movies