const subtitles = require('../libraries/subtitles')
const fs = require("fs");

const Captions = {
    findCaptions: async (imdb) => {
    try {
      const enfilesExist = await fs.existsSync(`./movies/vtt/${imdb}/en/${imdb}.vtt`);
      const frfilesExist = await fs.existsSync(`./movies/vtt/${imdb}/fr/${imdb}.vtt`);
      if(!enfilesExist)
        await fs.mkdirSync(`./movies/vtt/${imdb}/en/`,{ recursive: true });
      if(!frfilesExist)
        await fs.mkdirSync(`./movies/vtt/${imdb}/fr/`,{ recursive: true });

      console.log("getting captions from yify...");
      const subs = await subtitles(imdb, `./movies/vtt/${imdb}`);
      return subs
    } catch (e) {
      throw new Error(e.message);
    }
  },
}


  module.exports = Captions;