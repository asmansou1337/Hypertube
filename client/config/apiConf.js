const execSync = require("child_process").execSync;

const apiConf = {
    apiIP : execSync("getent hosts server | awk '{print $1}'").toString().trim(),
    apiPort: 3000
}
 
module.exports = apiConf;