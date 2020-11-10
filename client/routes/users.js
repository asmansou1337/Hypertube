const express = require("express");
const userRouter = new express.Router();
var contextService = require('request-context')
const userController = require('../controller/users')
const verifyAuth = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const lang = require('../middlewares/setLanguage')
const checkUrl = require('../helpers/checkUrl');
const Dictionary = require('../libraries/dictionary')

var ObjectId = require('mongoose').Types.ObjectId;


userRouter.post('/register', lang, async (req, res)=> {
    try{
        await userController.userRegister(req.body)
        res.send({success: Dictionary().UCS})
    }
    catch(e){
        res.send({error: e.message})
    }
})


userRouter.get('/forgot', async (req, res) => {
    res.render("pages/forgotPassword");
})

userRouter.post('/forgot', lang, async (req, res) => {
    try{
        let result = await userController.userSendForgot(req.body)
        if(result) {
            req.flash('msg', Dictionary().RCSCYE)
            result = req.flash().msg
        }
        else
            result = undefined
         res.render("pages/forgotPassword", {result});

    }
    catch(e){
        console.log(e.message)
        req.flash('error', e.message)
        const errors = req.flash().error
        res.render("pages/forgotPassword", {errors});
    }
})

userRouter.get('/confirm/:token', async (req, res) => {
    try{
        await userController.userConfirm(req.params.token)
        res.render("pages/auth", {success:  Dictionary().UCNF});
    }
    catch(e){
        console.log(e.message)
        res.render("pages/auth", {error: e.message});
    }
})

userRouter.get('/reset/:token', async (req, res) => {
    res.render("pages/resetPassword", {token: req.params.token});
})


userRouter.post('/reset/:token', lang, async (req ,res) => {
    try{
        req.body.token = req.params.token
        await userController.userReset(req.body)
        res.render("pages/auth", {success: Dictionary().RS});
    }
    catch (e) {
        res.render("pages/resetPassword", {error: e.message, token: req.body.token});
    }
})

// post Edit Profile
userRouter.post('/me', verifyAuth, lang, async (req, res) => {
    try{
        const uid = req.user._id
        const result = await userController.userEdit(req.body, uid)
        /// should render new user from result
        // console.log(result)
        if(!checkUrl(result.profileImg))
        {
            result.profileImg = '/images/'+ result.profileImg
        }
        req.user = result
        res.cookie('lang',result.language)
        res.render('pages/editProfile',{user : result,success : [Dictionary().US],errors : undefined})
    }
    catch (e) {
        // should render errors with user
        if(!checkUrl(req.user.profileImg))
        {
            req.user.profileImg = '/images/'+ req.user.profileImg

        }
        console.log(e.message)
        res.render('pages/editProfile',{user : req.user,success : undefined , errors : [e.message]})
    }
})

// my profile
userRouter.get('/me',verifyAuth, async (req, res) => {
    try{
        const user = req.user
        if(!checkUrl(user.profileImg)){
            user.profileImg = '/images/'+ user.profileImg
        }
        let msg = req.flash()
        const errors = msg.error || undefined
        const success = msg.success || undefined
        // should render page with user info
        res.render('pages/editProfile',{user,errors,success})
    }
    catch (e) {
        // should render errors with user
        if(!checkUrl(user.profileImg)){
            user.profileImg = '/images/'+ user.profileImg
        }
        const errors = e.message
        res.render('pages/editProfile',{user,errors,success : undefined })
        console.log(e.message)

    }
})

// change password

// userRouter.get('/changePassword',verifyAuth, async (req, res) => {
//     try{
//         const user = req.user
//         let msg = req.flash()
//         // should render page to add password if user has not set it yet 
//         if(user.password)
//             res.render('pages/changePassword')
//         else
//             res.redirect('/users/addPassword')
//     }
//     catch (e) {
//         // should render errors with user
//         console.log(e.message)
//     }
// })

// userRouter.get('/addPassword',verifyAuth, async (req, res) => {
//     try{
//         const user = req.user
//         let msg = req.flash()
//         // should render page to add password if user has not set it yet 
//         if(user.password)
//             res.redirect('/users/changePassword')
//         else 
//             res.render('pages/addPassword')
//     }
//     catch (e) {
//         // should render errors with user
//         console.log(e.message)
//     }
// })

userRouter.post('/change',verifyAuth, lang, async (req, res) => {
    try{
        const uid = req.user._id
        let result  = null
        if(req.user.password)
             result = await userController.userChangePwd(req.body,uid)
        // should render page with success message
        req.flash('success', Dictionary().CS)
        return res.redirect('/users/me')
    }
    catch (e) {
        // should render errors with errors message
        console.log(e.message)
        req.flash('error', e.message)
        return res.redirect('/users/me')
    }
})

// userRouter.post('/addPassword',lang, async (req, res) => {
//     try{
//         const uid = req.user._id
//         let result  = null
//         if(!req.user.password)
//              result = await userController.userAddPwd(req.body,uid)
//         // should render page with success message
//         res.render('pages/addPassword',{success : [Dictionary().US],errors : undefined})
//     }
//     catch (e) {
//         // should render errors with errors message
//         console.log(e.message)
//         res.render('pages/addPassword',{success : undefined , errors : [e.message]})
//     }
// })

userRouter.post('/upload', verifyAuth, lang, upload, async (req, res) => {
    try{
        if(typeof req.fileError == 'string'){
            req.flash('error', req.fileError)
        return res.redirect('/users/me')
      }
    const user = await userController.userUpdatePic(req.file.filename, req.user._id)
    req.user = user
    req.flash('success', Dictionary().PUS)
    return res.redirect('/users/me')
    }
    catch (e) {
        console.log(e.message)
    }
})


userRouter.get('/view/:uid', verifyAuth, lang, async (req, res) => {
    try{
    //http://localhost/users/view/5f6d1d57ee05cb00ca5e3572
        let uid = req.params.uid
        if(ObjectId.isValid(uid))
        {
            let result = await userController.userView(uid)
            // should render page with success message
            if(!checkUrl(result.profileImg)){
                result.profileImg = '/images/'+ result.profileImg
            }
            res.render('pages/viewUser',{user : result , errors : undefined})
        }
        else
            res.render('pages/error',{success : undefined , error : Dictionary().SWWUCBF})
    }
    catch (e) {
        // should render errors with errors message
        console.log(e.message)
        res.render('pages/error',{success : undefined , error : e.message})
    }
})

module.exports = userRouter;