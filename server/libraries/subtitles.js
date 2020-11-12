const cheerio = require("cheerio");
const got = require("got");
const fs = require("fs");
const srt2vtt = require("srt-to-vtt");
const unzipper = require("unzipper").Parse;
const streamz = require("streamz");
const path = require("path");
const chalk = require('chalk');

const YifySubtitleScraper = async (imdb) => {
  try {
    const uri = `https://yts-subs.com/movie-imdb/${imdb}`;
    console.log(chalk.yellow("getting to yts-subs..."));
    const data = await got(uri);
    // cheerio: implementation of core jQuery designed specifically for the server
    const $ = await cheerio.load(data.body);
    let arrFR = [];
    let arrEN = [];
    $("a")
      .filter(function () {
        if(!$(this).attr("href"))
          throw new Error('Subtitles Not Found')
        if ($(this).attr("href").includes("french"))
          arrFR.push($(this).attr("href"));
        if ($(this).attr("href") && $(this).attr("href").includes("english"))
          arrEN.push($(this).attr("href"));
      })
      .next()
      .text();
    console.log(chalk.green(`Got links Fr: ${arrFR[0]} En: ${arrEN[0]}`));
    return {
      French:
        arrFR.length > 0 &&
        `https://yifysubtitles.org/subtitle/${arrFR[0].split("/")[2]}.zip`,
      English:
        arrEN.length > 0 &&
        `https://yifysubtitles.org/subtitle/${arrEN[0].split("/")[2]}.zip`,
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const DownloadSubtitles = async (link, fullPath, lang, imdb) => {
  console.log(`downloading ${lang} subtitle...`);

  const download = got.stream(link)
  download.on("error", (error) => {
    console.error(`Download failed: ${error.message}`);
  });

  download
  .pipe(unzipper())
  .pipe(
    streamz(
      async (entry) => {
        console.log(chalk.yellow(`streaming to save to file...`));
        const parsedPath = path.parse(entry.path);
        const filesExist = await fs.existsSync(`${fullPath}/${lang}`);
        console.log(chalk.yellow(`fileExist? => ${filesExist}...`));
        if (!filesExist) await fs.mkdirSync(`${fullPath}/${lang}`,{ recursive: true });
        console.log(
          chalk.yellow(`${parsedPath.name}.${parsedPath.ext} Saving as ${fullPath}/${lang}/${imdb}.srt...`)
        );
        return parsedPath.ext == ".srt"
          ? entry
              .pipe(srt2vtt())
              .pipe(fs.createWriteStream(`${fullPath}/${lang}/${imdb}.vtt`))
              .on("error", (e) => {
                throw new Error(e.message);
              })
          : entry
              .pipe(fs.createWriteStream(`${fullPath}/${lang}/${imdb}.vtt`))
              .on("error", (e) => {
                throw new Error(e.message);
              });
      },
      {
        catch: (e) => console.log(chalk.red(`Streamz Error: ${e.message}`)),
      }
    )
  )
};

const getSubtitles = async (imdb, fullPath) => {
  try {
    const downloadLink = await YifySubtitleScraper(imdb);
    if (!downloadLink) throw new Error(`No Subtitles Found`);
    let subtitles = [];
    if (downloadLink.English) {
      await DownloadSubtitles(downloadLink.English, fullPath, "en", imdb);
      subtitles.push({
        lang: "english",
        langShort: "en",
        path: `movies/vtt/${imdb}/en/${imdb}.vtt`,
        fileName: `${imdb}.vtt`,
      });
    }
    if (downloadLink.French){
      await DownloadSubtitles(downloadLink.French, fullPath, "fr", imdb);
      subtitles.push({
        lang: "french",
        langShort: "fr",
        path: `movies/vtt/${imdb}/fr/${imdb}.vtt`,
        fileName: `${imdb}.vtt`,
      });
    }
    return subtitles
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = getSubtitles;
