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
setTimeout(function(){
 document.querySelector('.videoContainer').style.display = 'none';
}, 7000)
});

var errorDisplay = myPlayer.getChild('errorDisplay');
errorDisplay.off(myPlayer, 'error', errorDisplay.open);
   
   function loadTorrent(hash) {
     document.querySelector('.videoContainer').style.display = 'block';
     var movieId = document.getElementsByClassName('videoContainer') && document.getElementsByClassName('videoContainer')[0].id
     myPlayer.src(
     {
       type: "video/mp4",
       src: `http://localhost:3000/movies/watch/${movieId}?hash=${hash}`,
     },
     {
       type: "video/ogg",
       src: `http://localhost:3000/movies/watch/${movieId}?hash=${hash}`,
     },
     {
       type: "video/webm",
       src: `http://localhost:3000/movies/watch/${movieId}?hash=${hash}`,
     }
   );
   $("#modalTorrents").modal("hide");
   }

myPlayer.ready(async function () {
// Set volume to half by default
myPlayer.volume(0.5);
// Get Captions
var imdb = document.getElementsByClassName('player') && document.getElementsByClassName('player')[0].id      
const enSubs = await axios.get(`/movies/captions/${imdb}?lang=en`)
if (enSubs) {
 if (enSubs.data !== "")
     myPlayer.addRemoteTextTrack(
       {
         kind: "captions",
         src: `/movies/captions/${imdb}?lang=en`,
         srclang: "en",
         label: (getCookie('lang') == 'fr') ? "Anglais" : "English",
       },
       true
     );
}
 
const frSubs = await axios.get(`/movies/captions/${imdb}?lang=fr`)
if (frSubs) {
 if (frSubs.data !== "")
     myPlayer.addRemoteTextTrack(
       {
         kind: "captions",
         src: `/movies/captions/${imdb}?lang=fr`,
         srclang: "fr",
         label: (getCookie('lang') == 'fr') ? "Francais" : "French",
       },
       true
     );
}
});

myPlayer.on('play', async function() {
    // Mark the video as watched
  var imdb = document.getElementsByClassName('player') && document.getElementsByClassName('player')[0].id 
  const watched = await axios.post(`/movies/${imdb}/watched`)
  if (!watched)
    toastr('Error')
  document.querySelector('.watchedBtn').classList.replace('btnColorGrey', 'btnColorTeal')
});

 