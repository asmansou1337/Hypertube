const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FortyTwoStrategy = require('passport-42').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github').Strategy;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const utilities = require('../libraries/utilities')
const keys = require("./keys");
const User = require("../model/user");


passport.serializeUser((user, done) => {
  if(user.id)
    done(null, user.id);
  else 
    done(null, false)
});

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

//Github Strategy
passport.use(new GitHubStrategy(
  keys.Github,
  async (accessToken, refreshToken, profile, done) => {
    try {
      await User.findOne(
        { githubID: profile._json.id},
        async (error, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id.toString() }, "Hypertube");
            user.jwt = token;
            await user.save();
            console.log("A User With Github Strategy Already Exists...", { jwt: token });
            return done(null, user);
          }
          const username = await utilities.genUserName()
          const GeneratedProfilePic = await utilities.genProfilePic(username)
          const newUser = new User({
            username,
            firstname: profile._json.name || undefined,
            githubID: profile._json.id,
            email: profile._json.email || undefined,
            profileImg: profile._json.avatar_url || GeneratedProfilePic,
            verified: true
          });

          const created = await newUser.save();
          if (created) {
            const token = jwt.sign(
              { _id: created._id.toString() },
              "Hypertube"
            );
            created.jwt = token;
            await created.save();
            done(null, user);
            console.log("New User With Github Strategy Created Succesfully...", {
              jwt: token,
            });
          }
        }
      );
    } catch (e) {
      console.log(e.message);
    }
  }
));

passport.use(new LocalStrategy({
  /// local strategy mainly uses username this is a workround the issue
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  async (req, username, password, done) => {
    try {
      await User.findOne({ email: username }, async (err, user) => {
      if (err) return done(null, false,req.flash('error',e));
      if (!user) return done(null, false,  req.flash('error','USER_NOT_FOUND'));
      if(!user.password) return done(null, false,  req.flash('error','ERR_PASS'));
      const validPass = await bcrypt.compare(password, user.password)
      if (!validPass) return done(null, false, req.flash('error','PASS_NOT_MATCH'));
      if(!user.verified) return done(null, false, req.flash('error','ACTIVATE_ACCOUNT'));
      const token = jwt.sign({ _id: user._id.toString() }, "Hypertube");
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
       await User.findOne(
          { googleID: profile._json.sub},
          async (error, user) => {
            if (user) {
              const token = jwt.sign({ _id: user._id.toString() }, "Hypertube");
              user.jwt = token;
              await user.save();
              console.log("A User With Google Strategy Already Exists...", { jwt: token });
              return done(null, user);
            }
            else {
              const username = await utilities.genUserName()
              const newUser = new User({
              username,
              firstname: profile._json.given_name,
              lastname: profile._json.family_name,
              googleID: profile._json.sub,
              email: profile._json.email,
              profileImg: profile._json.picture,
              verified: true,
            });
            const created = await newUser.save();
            if (created) {
              const token = jwt.sign(
                { _id: created._id.toString() },
                "Hypertube"
              );
              created.jwt = token;
              await created.save();
              done(null, user);
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
      try {
        await User.findOne(
          { fortytwoID: profile.id},
          async (error, user) => {
            if (user) {
              const token = jwt.sign({ _id: user._id.toString() }, "Hypertube");
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
                "Hypertube"
              );
              created.jwt = token;
              await created.save();
              done(null, user);
              console.log("New User With FortyTwo Strategy Created Succesfully...", {
                jwt: token,
              });
            }
          }
        );
      } catch (e) {
        console.log(e.message);
      }
    }
  )
);

/// Facebook Strategy
passport.use(new FacebookStrategy(
  // facebook key
  keys.Facebook,
  async (accessToken, refreshToken, profile, done) => {
    try {
      await User.findOne(
        { facebookID: profile.id},
        async (error, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id.toString() }, "Hypertube");
            user.jwt = token;
            await user.save();
            console.log("A User With Facebook Strategy Already Exists...", { jwt: token });
            return done(null, user);
          }
          const username = await utilities.genUserName()
          const GeneratedProfilePic = await utilities.genProfilePic(username)
          const newUser = new User({
            lastname: profile.name.familyName || undefined,
            firstname: profile.name.givenName || profile.displayName ||undefined,
            username,
            facebookID: profile._json.id,
            profileImg: profile.photos[0].value || GeneratedProfilePic,
            verified: true
          });
          const created = await newUser.save();
          if (created) {
            const token = jwt.sign(
              { _id: created._id.toString() },
              "Hypertube"
            );
            created.jwt = token;
            await created.save();
            done(null, user);
            console.log("New User With Facebook Strategy Created Succesfully...", {
              jwt: token,
            });
          }
        }
      );
    } catch (e) {
      console.log(e.message);
    }
  }
)
);

