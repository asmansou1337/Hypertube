const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FortyTwoStrategy = require('passport-42').Strategy
const LocalStrategy = require('passport-local').Strategy
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const utilities = require('../libraries/utilities')
const keys = require("./keys");
const User = require("../model/user");

// Passport generates a token and send it to the browser
passport.serializeUser((user, done) => {
  if(user.id)
    done(null, user.id);
  else 
    done(null, false)
});

// take the identifying token and turn it into a user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) done(null, user);
    else 
      done(null, false)
  } catch (e) {
    console.log(e.message);
  }
});

// Local strategy
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
  async (req, username, password, done) => {
    try {
      await User.findOne({ username: username }, async (err, user) => {
      if (err) return done(null, false,req.flash('error',e));
      if (!user) return done(null, false,  req.flash('error','USER_NOT_FOUND'));
      if(!user.password) return done(null, false,  req.flash('error','ERR_PASS'));
      const validPass = await bcrypt.compare(password, user.password)
      if (!validPass) return done(null, false, req.flash('error','PASS_NOT_MATCH'));
      if(!user.verified) return done(null, false, req.flash('error','ACTIVATE_ACCOUNT'));
      const token = jwt.sign({ _id: user._id.toString() }, 'Hypertube');
      user.jwt = token;
      await user.save();
      console.log("A Local User Exists...", { jwt: token });
      return done(null, user);
    });
    }
    catch (e) {
      console.log(e.message)
    }
  }
));


// Google Strategy
passport.use(
  new GoogleStrategy(
    /// google creds
    keys.google,
    /// middleware callback function for passport
    async (accessToken, refreshToken, profile, done) => {
      try {
       await User.findOne({ googleID: profile._json.sub}, async (error, user) => {
            if (user) {
              const token = jwt.sign({ _id: user._id.toString() }, 'Hypertube');
              user.jwt = token;
              await user.save();
              console.log("A User With Google Strategy Already Exists...", { jwt: token });
              return done(null, user);
            }
            else {
              const username = await utilities.genUserName()
              const profileImg = await utilities.genProfilePic(username)
              const newUser = new User({
              username,
              firstname: profile._json.given_name,
              lastname: profile._json.family_name,
              googleID: profile._json.sub,
              email: profile._json.email,
              profileImg,
              verified: true,
            });
            const created = await newUser.save();
            if (created) {
              const token = jwt.sign(
                { _id: created._id.toString() },
                'Hypertube'
              );
              created.jwt = token;
              await created.save();
              done(null, created);
              console.log("New User With Google Strategy Created Succesfully...", {
                jwt: token,
              });
            }
            }
          }
        );
      } catch (e) {
        console.log(e.message);
      }
    })
);

// FortyTwo Strategy
passport.use(new FortyTwoStrategy(
  // 42 key
  keys.FortTwo,
    /// middleware callback function for passport
    async (accessToken, refreshToken, profile, done) => {
      // console.log('profile id == ' + profile.id)
      try {
        await User.findOne({ fortytwoID: profile.id}, async (error, user) => {
            if (user) {
              const token = jwt.sign({ _id: user._id.toString() }, 'Hypertube');
              user.jwt = token;
              await user.save();
              console.log("A User With FortyTwo Strategy Already Exists...", { jwt: token });
              return done(null, user);
            }
            const username = await utilities.genUserName()
            const newUser = new User({
              username,
              firstname: profile._json.first_name,
              lastname: profile._json.last_name,
              fortytwoID: profile._json.id,
              email: profile._json.email,
              profileImg: profile._json.image_url,
              verified: true,
            });

            const created = await newUser.save();
            if (created) {
              const token = jwt.sign(
                { _id: created._id.toString() },
                'Hypertube'
              );
              created.jwt = token;
              await created.save();
              console.log("New User With FortyTwo Strategy Created Succesfully...", {
                jwt: token,
              });
              done(null, created);
            }
          }
        );
      } catch (e) {
        console.log(e.message);
      }
    }
  )
);
