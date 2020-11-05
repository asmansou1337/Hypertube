var addFavorites = document.getElementById("addFavorites");
var addWatchlist = document.getElementById("addWatchlist");

// Add/Remove from favorites
$(addFavorites).submit(function (e) {
  e.preventDefault();
  axios.post(`${addFavorites.action}`)
    .then((result) => {
        document.querySelector(".msgContainer").innerHTML = `<div class="card">
            <div class="card-body ${(result.data.add === 1) ? `success-color` : `danger-color`}">
                ${result.data.Message}
            </div>
        </div>`
        addFavorites.innerHTML = `<button class="btn text-light mdb-color ${(result.data.add === 1) ? `teal darken-1` : `darken-1`} btn-rounded favoriteBtn">
                <i class="fas fa-star"></i>
            </button>`
    })
    .catch((e) => {
      document.querySelector(".errorContainer").innerHTML = `<div class="card">
                        <div class="card-body danger-color">
                            ${e.message}
                        </div>
                    </div>`;
    });
});

// Add/Remove from watchlist
$(addWatchlist).submit(function (e) {
    e.preventDefault();
    axios.post(`${addWatchlist.action}`)
      .then((result) => {
          document.querySelector(".msgContainer").innerHTML = `<div class="card">
              <div class="card-body ${(result.data.add === 1) ? `success-color` : `danger-color`}">
                  ${result.data.Message}
              </div>
          </div>`
          addWatchlist.innerHTML = `<button class="btn text-light mdb-color ${(result.data.add === 1) ? `teal darken-1` : `darken-1`} btn-rounded favoriteBtn">
                <i class="fas fa-bookmark"></i>
              </button>`
      })
      .catch((e) => {
        document.querySelector(".errorContainer").innerHTML = `<div class="card">
                          <div class="card-body danger-color">
                              ${e.message}
                          </div>
                      </div>`;
      });
  });
  

