const execSync = require("child_process").execSync;

const mongoConf = {
    dbIP : execSync("getent hosts mongo | awk '{print $1}'").toString().trim(),
    dbPort: 27017,
    dbName: 'Hypertube'
}
 
module.exports = mongoConf;