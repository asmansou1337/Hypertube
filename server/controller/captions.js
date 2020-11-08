const subtitles = require('../libraries/subtitles')
const fs = require("fs");

const Captions = {
    findCaptions: async (imdb) => {
    try {
      let existingSubs = [];
      const enfilesExist = await fs.existsSync(`./movies/vtt/${imdb}/en/${imdb}.vtt`);
      const frfilesExist = await fs.existsSync(`./movies/vtt/${imdb}/fr/${imdb}.vtt`);
      if (enfilesExist && frfilesExist)
      {
        existingSubs.push({
          lang: "english",
          langShort: "en",
          path: `movies/vtt/${imdb}/en/${imdb}.vtt`,
          fileName: `${imdb}.vtt`,
        });
        existingSubs.push({
          lang: "french",
          langShort: "fr",
          path: `movies/vtt/${imdb}/fr/${imdb}.vtt`,
          fileName: `${imdb}.vtt`,
        });
        return existingSubs
      }
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