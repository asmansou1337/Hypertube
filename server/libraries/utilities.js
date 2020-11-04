const axios = require('axios')
const getHrefs = require('get-hrefs');
const chalk = require("chalk");

module.exports = {
  isVideo: async (name) => {
    name = name.toUpperCase();
    if (!name.match(/\.(MP4|WEBM|AVI|MKV|MPEG|MPG|MOV|QT|FLV)$/)) {
      return false;
    }
    return true;
  },
  isReadable: (name) => {
    name = name.toUpperCase();
    if (!name.match(/\.(MP4|WEBM)$/)) {
      return false;
    }
    return true
  },
  
   /**
   * Creates a Media stream Header 
   * @param  {} headerRange Content-Range from request header 
   * @param  {} totalBytes File to be streamed total Bytes 
   * @param  {} type video file extension "mp4" or "webm"
   * @returns {Header Created, starting in bytes, end in bytes}
   */
  createHeader: async (headerRange, totalBytes, type) => {
    console.log(chalk.yellow(headerRange))
    if(!headerRange || !totalBytes || !type)
      throw new Error(`Header could not be created headerRange: ${headerRange}, totalBytes: ${totalBytes}, Type: ${type}`)
    const position = headerRange.replace(/bytes=/, "").split("-");
    const start = parseInt(position[0], 10);
    const end = position[1] ? parseInt(position[1], 10) : totalBytes - 1;;
    let chunksize = end - start;
    return {
      Header: {
      "Content-Range": `bytes ${start}-${end}/${totalBytes}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": `video/${type}`
      },
      start,
      end
    }
  },

  /**
   * Gets requested language vtt file name from an array of found captions
   * @param  {} Captions Array
   * @returns {} Filename .vtt / false if not found
   */
  findRquestedLang: async (captions, lang) => {
    const reqLang = (caption) => caption.langShort === lang ;
    const FILE_INDEX = captions.findIndex(reqLang)
    if(FILE_INDEX < 0)
      return false
    return captions[FILE_INDEX].fileName
  },

  addHashes: async (torrents) => {
    try{
      let responsePromises = []
      for(let i = 0; i < torrents.length; i++){
        responsePromises.push(axios.get(`https://1337x.to${torrents[i].href}`))
      }
      const responses = await Promise.all(responsePromises)

      for(let i = 0; i < torrents.length; i++){
        if(!responses[i] || responses[i].status == 404 || responses[i].status == 400 || responses[i].data.length == 0)
        continue
        // Get all href urls from an HTML string
        const hrefs = getHrefs(responses[i].data)
        for (let j = 0; j < hrefs.length; j++){
            isHash = hrefs[j].match(/[A-Z0-9]{20,50}/i)
            if(isHash){
              torrents[i].hash = isHash[0]
              break
            }
        }
      }
      return torrents
    }
    catch (e) {
      console.log(e)
      return false
    }
}
  
};
