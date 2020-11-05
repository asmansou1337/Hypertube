

// Load More on scroll
var loadForm = document.getElementById("lazyLoad");
var page = 2;
var loading = document.getElementById('loading')

$( loadForm ).submit(function( e ) {
  e.preventDefault();
  loadForm.style.display = 'none';
  loading.style.display = 'block';
  axios.get(`/movies/loadMore?page=${page}`)
    .then((result) => {
        if (result.data.end === true) {
            // Hide load more button when reaching the end of list
            loadForm.style.display = 'none';
        } else {
            var movies = result.data.movies;
            var watched = result.data.watched;
            page++;
            appendMovies(movies, watched);
            if (result.data.final === false)
                loadForm.style.display = 'block';
        }
        loading.style.display = 'none';
    }).catch((e) => {
      document.querySelector('.errorContainer').innerHTML = `<div class="alert alert-danger" role="alert">
      ${e}
      </div>`;
    })
});


  function appendMovies(movies, watched) {
    var content = "";
    var btn = "";
    movies.forEach((movie) => {
      if (typeof watched !== 'undefined') {
        if (watched.length > 0 && watched.includes(movie.imdb_code)) { 
          btn = `<a class="btn-floating btn-action  btn-sm mt-n4 ml-n2 mdb-color  teal lighten-2 waves-effect waves-light"><i class="fas fa-eye"></i></a>`
         } else { 
          btn = `<a class="btn-floating btn-action  btn-sm mt-n4 ml-n2 mdb-color watchBtn waves-effect waves-light"><i class="fas fa-eye-slash"></i></a>`
       }} 

    content += `<div class="col-lg-3 col-md-6 col-sm-12 p-3">
                          <div class="card collection-card">
                          ${btn}
                            <div class="view zoom">
                              <img
                                class="img-fluid"
                                src="${movie.large_cover_image}"
                                alt="${movie.title}"
                              />
                              <div class="stripe dark">
                              <a href="/movies/watch/${movie.id}?v=hash">
                                  <strong><p> ${movie.title}</p></strong>
                                  <p>(${movie.year}) <i class="fas fa-star"></i> ${movie.rating}</p>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>`;
      });
    document.getElementById("moviesContainer").innerHTML += content;
  }
  