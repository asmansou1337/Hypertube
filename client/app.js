const express = require("express");
const app = express();
const Auth = require("./routes/auth");
const Users = require('./routes/users')
const Movies = require('./routes/movies')
const Comments = require('./routes/comments')
const NotFound = require('./routes/error')
const mongoose = require("mongoose");
const { dbIP, dbPort, dbName } = require("./config/mongoConf");
const morgan = require('morgan')
const keys = require("./config/keys");
const cookieSession = require('cookie-session')
const passport = require('passport')
const passportConf = require("./config/passportConf");
const flash = require('connect-flash');
const setLanguage = require('./middlewares/setLanguage')


app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({
   extended: true
 }));
app.use(flash());
app.use(setLanguage)

mongoose.connect(
  `mongodb://${dbIP}:${dbPort}/${dbName}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => {
    console.log(`${dbName} Database Running...`);
  }
);

/// add serialize output to a cookie
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys : [keys.cookieKey]
}))

/// initialise passport
app.use(passport.initialize())
app.use(passport.session())

app.use(morgan('dev'))
app.use("/auth", Auth);
app.use("/users", Users);
app.use("/comments", Comments);
app.use("/movies", Movies)
app.use("/error", NotFound)
app.use('/', (req, res) =>{
  const user = req.user
    if (!user || !user.verified)
    return res.redirect('/auth/login') 
  return res.redirect('/movies') 
})

app.listen(80, () => {
  console.log("Client Running...");
});
