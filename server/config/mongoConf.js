
const execSync = require("child_process").execSync;
const dbIP = execSync("getent hosts mongo | awk '{print $1}'").toString().trim()
const dbPort =  27017
const dbName = 'Hypertube'

const mongoConf = {
    uri : `mongodb://${dbIP}:${dbPort}/${dbName}`,
    options:{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    status: () => {
        console.log(`${dbName} Database Running...`);
    }
}

module.exports =  mongoConf;