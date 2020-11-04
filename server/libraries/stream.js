const chalk = require("chalk");
const torrentStream = require("torrent-stream");
const { trackers } = require("../config/apiConf");
const utilities = require("../libraries/utilities");

const stream = {
  /**
   * Create an "torrent-stream" Engine instance From a magnet link
   * @param  {} Torrent Magnet
   * @returns Engine Instance
   */
  CreateEngine: async (magnet, imdb) => {
    console.log(chalk.yellow("Creating engine instance..."));
    const path = `./movies/${imdb}`
    const options = {
      path,
      tracker: true,
      trackers,
    };
    // torrent-stream is a node module that allows you to access files inside a torrent as node streams.
    const engine = torrentStream(magnet, options);
    return new Promise((resolve, reject) => {
      engine.on("ready", () => {
        console.log("Engine ready");
        return resolve(engine);
      });
      engine.on("error", () => {
        console.log("Engine Not Ready");
        return reject("Engine Error");
      });
    });
  },
  /**
   * Finds Movie file to stream from an engine instance
   * @param  {} engine instance
   * @returns { engine: file to stream, file: file information, found: true in case video file exists }
   */
  findStream: async (engine) => {
    const files = engine.torrent.files;
    const NUMBER_OF_FILES = files.length;
    if (NUMBER_OF_FILES === 0) throw new Error("No files found");
    let movie = {};
    console.log(chalk.yellow("Looking for video file..."));
    files.forEach(async (file, index) => {
      if (movie.isFound === true) return;
      valid = await utilities.isVideo(file.name);
      if (!valid) return;
      movie.engine = engine.files[index];
      movie.file = files[index];
      movie.isFound = true;
    });
    return movie;
  },

  convertStream : (file, start, end) => {
    try {
      const convertedFile = new FFmpeg(file.createReadStream({
        start,
        end
      }))
        .videoCodec("libvpx")
        .audioCodec("libvorbis")
        .format("webm")
        .audioBitrate(128)
        .videoBitrate(8000)
        .outputOptions([`-threads 5`, "-deadline realtime", "-error-resilient 1"])
        .on("error", err => {
          console.log(err)
        });
      return convertedFile;
    } catch (err) {
      return file.createReadStream({
        start,
        end
      });
    } 
  },
  promiseTimeout : (ms, promise) => {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.')
        }, ms)
    })
    return Promise.race([
        promise,
        timeout
    ])
  }
};

module.exports = stream;
