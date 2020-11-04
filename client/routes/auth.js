const express = require("express");
// const conf = require("../config")
const authRouter = new express.Router();
// const api = `http://${conf.apiIp}:${conf.portNumApi}`
const passport = require("passport");
const lang = require('../middlewares/setLanguage')
const utilities = require('../libraries/utilities')


/// Google Auth
authRouter.get("/google",passport.authenticate("google", {scope: ["profile", "email"]}));

authRouter.get("/google/redirect",passport.authenticate("google", { failureRedirect: '/auth/login' }), (req, res) => {
  res.cookie('lang',req.user.language)
  res.redirect('/movies');
  }
);
/// End Google Auth

/// 42 Auth
authRouter.get("/fortytwo", passport.authenticate("42"));

authRouter.get("/fortytwo/redirect",passport.authenticate("42" , { failureRedirect: '/auth/login' }),(req, res) => {
  res.cookie('lang',req.user.language)
  res.redirect('/movies');
  }
);
// END 42 Auth


// Github Auth
// authRouter.get('/github', passport.authenticate('github'));

// authRouter.get('/github/redirect', passport.authenticate('github', { failureRedirect: '/auth/login' }), (req, res) => {
//   res.cookie('lang',req.user.language)
//     res.redirect('/movies');
// });
//END Github Auth

// Facebook Auth
// authRouter.get('/facebook', passport.authenticate('facebook'));

// authRouter.get('/facebook/redirect',passport.authenticate('facebook' , { failureRedirect: '/auth/login' }), (req, res) => {
//     res.cookie('lang',req.user.language)
//     res.redirect('/movies');
// });
// END Facebook Auth

authRouter.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }),(req, res) => {
  res.cookie('lang',req.user.language)
  res.redirect('/movies');
});

authRouter.get("/login",lang, async (req, res) => {
   let msg = req.flash()
  const cookies = await utilities.getCookie(req.headers.cookie)
   const translatedErrors = await utilities.offlineTranslate(msg.error, cookies.lang)
   const errors = translatedErrors || []
   const results = msg.result || []
  res.render("pages/auth", {errors,results});
});
authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = authRouter;
