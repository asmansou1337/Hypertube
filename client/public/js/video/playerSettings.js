 // Silent the log error from videojs
 window.videojs.log.level('off');
 var myPlayer = videojs(document.querySelector(".video-js"), {
   playbackRates: [0.5, 1, 1.5, 2],
   textTrackSettings: false,
   language: (getCookie('lang') == 'fr') ? 'fr' : 'en',
 }
 );
 // Styling the video player
myPlayer.addClass("vjs-styling");

myPlayer.on('error', function() {
toastr.error(`${(getCookie('lang') == 'fr') ? 'Le video n\'a pas pu être chargé' : 'The media could not be loaded'}`);
});

var errorDisplay = myPlayer.getChild('errorDisplay');
errorDisplay.off(myPlayer, 'error', errorDisplay.open);
   
   function loadTorrent(hash) {
     var movieId = document.getElementsByClassName('videoContainer') && document.getElementsByClassName('videoContainer')[0].id
     myPlayer.src(
     {
       type: "video/mp4",
       src: `http://134.209.183.92:3000/movies/watch/${movieId}?hash=${hash}`,
     },
     {
       type: "video/ogg",
       src: `http://134.209.183.92:3000/movies/watch/${movieId}?hash=${hash}`,
     },
     {
       type: "video/webm",
       src: `http://134.209.183.92:3000/movies/watch/${movieId}?hash=${hash}`,
     }
   );
   $("#modalTorrents").modal("hide");
   }

myPlayer.ready(async function () {
// Set volume to half by default
myPlayer.volume(0.5);
  // Get Captions
  var imdb = document.getElementsByClassName('player') && document.getElementsByClassName('player')[0].id      
  await axios.get(`/movies/captions/${imdb}?lang=en`)
  .then((resp) => {
    if (resp.data !== "")
       myPlayer.addRemoteTextTrack(
         {
           kind: "captions",
           src: `/movies/captions/${imdb}?lang=en`,
           srclang: "en",
           label: (getCookie('lang') == 'fr') ? "Anglais" : "English",
         },
         true
       );
  }).catch()
   
  await axios.get(`/movies/captions/${imdb}?lang=fr`)
  .then((resp) => {
    if (resp.data !== "")
       myPlayer.addRemoteTextTrack(
         {
           kind: "captions",
           src: `/movies/captions/${imdb}?lang=fr`,
           srclang: "fr",
           label: (getCookie('lang') == 'fr') ? "Francais" : "French",
         },
         true
       );
  }).catch()
});

myPlayer.on('play', async function() {
    // Mark the video as watched
  var imdb = document.getElementsByClassName('player') && document.getElementsByClassName('player')[0].id 
  const watched = await axios.post(`/movies/${imdb}/watched`)
  if (!watched)
    toastr('Error')
  document.querySelector('.watchedBtn').classList.replace('btnColorGrey', 'btnColorTeal')
});

 