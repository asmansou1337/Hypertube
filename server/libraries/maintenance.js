const cron = require("node-cron");
const movieModel = require("../model/movie");
const timediff = require("timediff");
const fs = require("fs");
const rimraf = require("rimraf");

const Maintenance = {
  deleteUnwatched: () => {
    cron.schedule("0 0 * * *", async () => {
      const movies = await movieModel.find();
      const CURRENT_DAY = new Date();
      if (movies.length > 0) {
        for (let i = 0; i < movies.length; i++) {
          var duration = timediff(movies[i].WatchedOn, CURRENT_DAY, "YDHms");
          if (duration.days > 30)
            var DIR_EXISTS = await fs.existsSync(`./movies/${movies[i].imdbCode}`);
          if (DIR_EXISTS) {
            rimraf(`${movies[i].File}`, async (error) => {
              if (!error) {
                const deleted = await movieModel.deleteOne({
                  imdbCode: movies[i].imdbCode,
                });
                if (deleted)
                  console.log(
                    `Maintenance Message: Removed Movie ${movies[i].imdbCode} for Exceding 30 days`
                  );
              }
            });
          }
        }
      }
    });
  },
};
module.exports = Maintenance;
