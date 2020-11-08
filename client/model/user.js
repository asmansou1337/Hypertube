const mongoose = require('mongoose')

const mongooseValidationErrorTransform = require('mongoose-validation-error-transform');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const Dictionary = require('../libraries/dictionary')


/// remove mongoose default error example "user validation failed: password: errmessage"
mongoose.plugin(mongooseValidationErrorTransform, {
  capitalize: true,
  humanize: true,
  transform: function(messages) {
    return messages.join(', ');
  }
});

const Schema = mongoose.Schema

const userSchema = new Schema({
    uuid: String,

    username: {
        type: String,
        trim: true,
        validate(value){
            const userNameRegex = new RegExp(/^(?=.{5,26}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
            if(value == "") 
                throw new Error(Dictionary().REQUIRED_UNAME)
            else if(!userNameRegex.test(value))
                throw new Error(Dictionary().ERR_UNAME)
        }
    },

    firstname:{
        type: String,
        trim: true,
        // required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isAlpha(value, ['fr-FR']) || value > 42 || value < 2) {
                throw new Error(Dictionary().ERR_FNAME)
            }
        }
    },

    lastname:{
        type: String,
        trim: true,
        // required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isAlpha(value, ['fr-FR']) || value > 42 || value < 2) {
                throw new Error(Dictionary().ERR_LNAME)
            }
        }
    },

    email:{
        type: String,
        trim: true,
        // required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(Dictionary().ERR_EMAIL)
            }
        }
    },

    profileImg: {
        type: String,
        trim: true,
        validate(value){
            if(value == "") 
            throw new Error(Dictionary().REQUIRED_PICTURE)
        }
    },

    password: {
        type: String,
        validate(value) {
            if(value == "") 
                throw new Error(Dictionary().REQ_PASS)
            const passwordRgex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
            if (!passwordRgex.test(value) || value.length < 8 ||  value.length > 128) {
                throw new Error(Dictionary().ERR_PASS)
            }
        }
    },
    githubID: String,

    fortytwoID: String,

    googleID: String,

    facebookID: String,

    token:String,

    language: {
        type: String,
        validate(value){
            if(value !== 'fr' && value !== 'en') 
                throw new Error(Dictionary().ERR_LANG)
        }
    },

    favorites: Array,

    watchlist: Array,

    watched: Array,
    
    jwt: String,

    verified: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next){
    const user = this
    const SALT_ROUNDS = 8
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
    }
    next()
})  

const User = mongoose.model('user', userSchema)

module.exports = User
