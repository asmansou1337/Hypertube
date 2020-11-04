// npm modules
const axios = require("axios");
const fileExtension = require("file-extension");
const xtorrent = require("xtorrent");
const chalk = require('chalk');

// local modules
const utilities = require("../libraries/utilities");
const stream = require("../libraries/stream");
const movieModel = require('../model/movie')

const Movies = {
  watchMovie: async (req, res) => {
    try {
      const { hash } = req.query;
      const { imdb } = req.params
      const magnet = `magnet:?xt=urn:btih:${hash}`;
      const engine = stream.promiseTimeout(25000, stream.CreateEngine(magnet, imdb));
      engine.then(async engineInstance => {
          const movie = await stream.findStream(engineInstance);
          console.log(chalk.yellow('Stream Found...'))
          const updateDate = await movieModel.findOneAndUpdate({imdbCode: imdb},{$set: {WatchedOn:new Date(), File: `./movies/${imdb}`}},{ upsert: true, new: true})
          if(!updateDate) throw new Error("Something Went Wrong!");
          const FILE_LEN_BYTES = movie.file.length;
          var FILE_TYPE = fileExtension(movie.file.name);
          if (!movie.isFound) throw new Error("Movie Not found");
          const Readable = utilities.isReadable(movie.file.name);
          if (!Readable) FILE_TYPE = "webm";
          const ContentHeader = await utilities.createHeader(
            req.headers.range,
            FILE_LEN_BYTES,
            FILE_TYPE
          );
          // writes the HTTP header
          res.writeHead(206, ContentHeader.Header);
          let movieStream;
          if (!Readable)
            movieStream = stream.convertStream(
              movie.engine,
              ContentHeader.start,
              ContentHeader.end
            );
          else
            movieStream = movie.engine.createReadStream({
              start: ContentHeader.start,
              end: ContentHeader.end,
            });
          console.log({
            "Start: ":  ContentHeader.start,
            "End: " : ContentHeader.end
          })
          return movieStream.pipe(res).on('close', () => { 
            console.log(chalk.yellow('Pipe closed...')) 
            return res.end()
          })
      }).catch(error => {
        res.end();
      })
    } catch (e) {
      console.log(e);
      res.end();
    }
  },

  // Research List of movies
  listMovies: async (req, res) => {
    try {
      const ytsResponse = await axios.get(
        `https://yts.mx/api/v2/list_movies.json?page=${req.params.page}`,
        { params: req.query }
      );

      if (!ytsResponse.data)
        return res.status(400).send({ Error: "Something Went Wrong.." });
      
      if (ytsResponse.data.data.movie_count === 0)
        return res.status(404).send({ Message: "No Movie Found" });
      
      let movies = [...ytsResponse.data.data.movies];
      let Promises = [];
      // Gathering addtional torrents from secondary sources
      for (let i = 0; i < movies.length; i++) {
        Promises.push(
          xtorrent.search({ query: movies[i].title, category: "Movies" })
        );
      }
      const extraTorrents = await Promise.all(Promises);
      for (let i = 0; i < movies.length; i++) {
        if (movies[i].torrents)
          movies[i].torrents.push(...extraTorrents[i].torrents);
      }
      res.send({ movies , count: ytsResponse.data.data.movie_count});
      return res.end()
    } catch (e) {
      console.log(e.message)
      return res.status(400).send({ error: e.message });
    }
  },
  
  // Get Movie Details
  discoverMovie: async (req, res) => {
    try {
      const ytsResponse = await axios.get(
        `https://yts.mx/api/v2/movie_details.json?movie_id=${req.params.id}&with_images=true&with_cast=true`
      );

      if (!ytsResponse.data)
        return res.status(400).send({ Error: "Something Went Wrong.." });
        
      if (!ytsResponse.data.data.movie || ytsResponse.data.data.movie.title == null)
        return res.status(404).send({ Error: "Movie Not Found.." });

      let movie = ytsResponse.data.data.movie;

      if(!movie.torrents)
        throw new Error("No Torrents in YTS")
      
      if(movie.torrents) {
        movie.YTS = movie.torrents
        delete movie.torrents
      }

      const timeout = new Promise((resolve, reject) => {
        setTimeout(resolve, 8000, 'TOO_LONG');
      });
      // Load more torrents from a second source
      let xtorrents = xtorrent.search({
        query: movie.title,
        category: "Movies",
      });
      const xResponse = await Promise.race([timeout , xtorrents])
      
      if(xResponse === 'TOO_LONG')
        movie.LEETx = []
      
      if (xResponse.torrents && xResponse.torrents.length > 0){
        // Get hash code from href link
        LEETxTorrents = await utilities.addHashes(xResponse.torrents)
        movie.LEETx = LEETxTorrents
      } 

      return res.send({ movie });
    } catch (e) {
      console.log(e.message);
      return res.send({ error: e.message });
    }
  },
};

module.exports = Movies;
