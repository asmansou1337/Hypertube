const express = require("express");
const moviesRouter = new express.Router();
const moviesController = require("../controller/movies.js")
const Dictionary = require('../libraries/dictionary')
const verifyAuth = require('../middlewares/auth')
const checkUrl = require('../helpers/checkUrl');

nbrPage = null
params = null

// Browse Movies
moviesRouter.get('/', verifyAuth, async (req, res) => {
    try {
        let page = 1;
        params = {
            sort_by : 'download_count',
            order_by : 'desc',
            genre : 'all',
            quality : 'all',
            query_term : ''
        }
        const movies = await moviesController.movieList(page, params);
        const watched = await moviesController.watchedList(req.user.id)
        nbrPage = Math.ceil(movies.count / 20)
        let filter = {
            sort_by : 'title',
            order_by : 'asc',
            genre : 'all',
            quality : 'all',
            query_term : ''
        }
        return res.render('pages/home', {movies: movies.movies, filter, watched})
      } catch (e) {
            let error = e.message
            return res.render('pages/home', {movies: [], error})
      }
})

// Search A Movie with filter & sort options
moviesRouter.post('/', verifyAuth, async (req, res) => {
    try {
        let page = 1;
        params = {
            sort_by : req.body.sort_by,
            order_by : req.body.order_by,
            genre : req.body.genre,
            quality : req.body.quality,
            query_term : req.body.query_term
        }
        const movies = await moviesController.movieList(page, params);
        const watched = await moviesController.watchedList(req.user.id)
        nbrPage = Math.ceil(movies.count / 20)
        return res.render('pages/home', {movies: movies.movies, filter: params, watched})
      } catch (e) {
            let error = e.message
            return res.render('pages/home', {movies: [], error})
      }
})

// Load More Option
moviesRouter.get('/loadMore', verifyAuth, async (req, res) => {
    try {
        let page = req.query.page
        let final = false
        
        if (page <= nbrPage) {
            const movies = await moviesController.movieList(page, params);
            const watched = await moviesController.watchedList(req.user.id)
            if (page == nbrPage) final = true
            return res.send({movies : movies.movies, end: false, final, watched})
        } else {
            // end of list
            return res.send({end: true})
        }
      } catch (e) {
            let error = e.message
            return res.send({movies: [], error});
      }
})

// Movie detail page
moviesRouter.get('/watch/:id', verifyAuth, async (req, res, next) => {
    try {
    const id = req.params.id
    const movie = await moviesController.movieDiscover(id)
    if(!movie)
        throw new Error(Dictionary().SWWPTA)
    let inFavorites = 0, inWatchlist = 0, inWatched = 0
    if(req.user.favorites && req.user.favorites.includes(movie.imdb_code) === true) (inFavorites = 1) 
    if(req.user.watchlist && req.user.watchlist.includes(movie.imdb_code) === true) (inWatchlist = 1)
    if(req.user.watched && req.user.watched.includes(movie.imdb_code) === true) (inWatched = 1)
    if(!checkUrl(req.user.profileImg)){
        req.user.profileImg = '/images/'+ req.user.profileImg
    } 
    const user = { userId: req.user._id, username : req.user.username, profileImg: req.user.profileImg, inFavorites, inWatchlist, inWatched };
    let source
    for(let i = 0; i < movie.YTS.length; i++){  
        if (movie.YTS[i].quality === '720p'){
            source = movie.YTS[i].hash
            break;
        }
    }
    if(!source)
        source = movie.YTS[0].hash
    return res.render('pages/watch', { movie, user, source})
    }
    catch(e) {
        var error = new Error(e.message);
        res.render('pages/error', {error})
    }
})

moviesRouter.get('/captions/:id', verifyAuth, async (req, res) => {
    try {
        const lang = req.query.lang
        const id = req.params.id
        const caption = await moviesController.movieCaptions(id, lang)
        res.setHeader('content-type', 'text/vtt');
        return res.send(caption)
    } catch (e) {
       console.log(e.message)
        return res.end()
    }
})

// Add to watched list after finishing the movie
moviesRouter.post('/:imdb/watched', verifyAuth, async (req, res) => {
    try {
        const result = await moviesController.movieAddToWatched(req.params.imdb, req.user.id)
        return res.send(result)
    }
    catch (e) {
        console.log(e.message)
        return res.send(e.message);
    }
})

// Add/remove from watchlist for later
moviesRouter.post('/:imdb/watchlist', verifyAuth, async (req, res) => {
    try {
        const result = await moviesController.movieAddToWatchList(req.params.imdb, req.user.id)
        return res.send(result)
    }
    catch (e) {
        console.log(e.message)
        return res.status(400).send(e.message);
    }
})

// Add/Remove from favorites
moviesRouter.post('/:imdb/favorites', verifyAuth, async (req, res) => {
    try {
        const result = await moviesController.movieAddToFavorites(req.params.imdb, req.user.id)
        return res.send(result)
    }
    catch (e) {
        console.log(e.message)
        return res.status(400).send(e.message);
    }
})

moviesRouter.get('/favorites', async (req,res) => {
    const title = req.user && req.user.language === 'fr' ? 'Favoris' : 'Favorites'
    const Wrong = req.user && req.user.language === 'fr' ? 'Quelque chose a mal tourné ...' : 'Something Went Wrong...'
    const none = req.user && req.user.language === 'fr' ? 'Pas encore de favoris!' : 'No Favorites Yet !'
    try {
        if(!req.user)
            return res.render('pages/watchList', {title, error: "No User", movies: undefined})
        if(!req.user.favorites || req.user.favorites.length == 0)
            return res.render('pages/watchList', {title, error: none, movies: undefined})
        const movies = await moviesController.movieInfoByIds(req.user.favorites)
        return res.render('pages/watchList', {title,error: undefined, movies})
    }
    catch (e) {
        console.log(e.message)
        return res.render('pages/watchList', {title, error: Wrong, movies: undefined})
    }
})

// A middlware to verify if user is connected should be added
moviesRouter.get('/watched', async (req,res) => {
    const title = req.user && req.user.language === 'fr' ? 'Historique des films' : 'Watched Movies'
    const Wrong = req.user && req.user.language === 'fr' ? 'Quelque chose a mal tourné ...' : 'Something Went Wrong...'
    const none = req.user && req.user.language === 'fr' ? 'Pas encore d\'historique, regardez des films!' : 'No watch history yet, watch some movies !'
    try {
        if(!req.user)
            return res.render('pages/watchList', {title, error: "No User", movies: undefined})
        if(!req.user.watched || req.user.watched.length == 0)
            return res.render('pages/watchList', {title, error: none, movies: undefined})
        const movies = await moviesController.movieInfoByIds(req.user.watched)
        return res.render('pages/watchList', {title,error: undefined, movies})
    }
    catch (e) {
        console.log(e.message)
        return res.render('pages/watchList', {title, error: Wrong, movies: undefined})
    }
})
moviesRouter.get('/watchlist', async (req,res) => {
    const title = req.user && req.user.language === 'fr' ? 'List des Films' : 'Watch List'
    const Wrong = req.user && req.user.language === 'fr' ? 'Quelque chose a mal tourné ...' : 'Something Went Wrong...'
    const none = req.user && req.user.language === 'fr' ? 'Pas encore de liste, ajoutez quelques films!' : 'No watchlist yet, add some movies !'
    try {
        /// the imdb api is limited by 1000 requests a day
        // const TEST_USER_FAVS = ['tt0090190', 'tt0803093']
        // const results = await moviesController.movieInfoByIds(TEST_USER_FAVS)
        if(!req.user)
            return res.render('pages/watchList', {title, error: "No User", movies: undefined})
        if(!req.user.watchlist || req.user.watchlist.length == 0)
            return res.render('pages/watchList', {title, error: none, movies: undefined})
        const movies = await moviesController.movieInfoByIds(req.user.watchlist)
        return res.render('pages/watchList', {title,error: undefined, movies})
    }
    catch (e) {
        console.log(e.message)
        return res.render('pages/watchList', {title, error: Wrong, movies: undefined})
    }
})

module.exports = moviesRouter
