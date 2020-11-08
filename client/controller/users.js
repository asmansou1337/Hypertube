const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const TokenGenerator = require('uuid-token-generator');
const Token = new TokenGenerator(); // 128-bit token encoded in base58
const mailHandler = require('../libraries/mailhandler')
const utilities = require('../libraries/utilities')
const Dictionary = require('../libraries/dictionary')
const bcrypt = require('bcryptjs')

const User = {
  userRegister: async (user) => {
    try{
    const Body = Object.keys(user)
    const Allowed = ['password','lastname','firstname','email','username', 'confirm']
    // check every element of body if it has the allowed array elements returns false if one element doest correspond
    const isValidOperation = Body.every((element) => Allowed.includes(element))
    if(!isValidOperation)
        // Not a valid operation Element not Allowed
        throw new Error(Dictionary().INVALID_OPERATION)
    if(Body.length != Allowed.length)
        // One or More element(s) is/are missing
        throw new Error(Dictionary().ELMENTS_MISSING)
    if(user.password !== user.confirm)
        // Passwords do not match
        throw new Error(Dictionary().PASS_NOT_MATCH)
      const found = await userModel.findOne( { $or:[{username:user.username}, {email:user.email} ]})
        if(!found){
            console.log("User by the same name or email not found Creating new one...")
            const confirmToken = Token.generate()
            const profileImg = await utilities.genProfilePic(user.username)

            const newUser = new userModel({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                profileImg,
                token: confirmToken
              });
              const created = await newUser.save();
              if (created) {
                const token = jwt.sign(
                  { _id: created._id.toString() },
                  "Hypertube"
                );
                created.jwt = token;
                await created.save();
                console.log('Sending Confirmation Email...')
                await  mailHandler.sendConfirmation(user.email, confirmToken)
                console.log("New Local User Created Succesfully... \n");
                return created
              }
              else {
                // throw new Error("Something Went Wrong !, error: UREG1")
                throw new Error(Dictionary().SWW_UREG1)
              }
        }
        else {
          if(found.username == user.username && found.username)
            // An account by same Username Already exists
            throw new Error(Dictionary().UNAME_AEXISTS)
          if(found.email == user.email && found.email)
            // An account by same Email Already exists
            throw new Error(Dictionary().EMAIL_AEXISTS)
          else 
            throw new Error(Dictionary().SWW_UREG2)
        }
      }
      catch(e){
          throw new Error(e.message)
      }
  },

  userReset: async (data) => {
    try{
      const Body = Object.keys(data)
      const Allowed = ['password','token','confirm']
      //// check every element of body if it has the allowed array elements returns false if one element doest correspond
      const isValidOperation = Body.every((element) => Allowed.includes(element))

      if(!isValidOperation)
          // Not a valid operation Element not Allowed
          throw new Error(Dictionary().INVALID_OPERATION)
      if(Body.length != Allowed.length)
          // One or More element(s) is/are missing
          throw new Error(Dictionary().ELMENTS_MISSING)
      if(data.password !== data.confirm)
          // Passwords do not match
          throw new Error(Dictionary().PASS_NOT_MATCH)

      /// to validate token using validator lib
      const user = await userModel.findOne({token:data.token})
      if(!user) 
        // User Not Found !
        throw new Error(Dictionary().USER_NOT_FOUND)

      
      if(!user.verified)
        // Activate Account first
        throw new Error(Dictionary().ACTIVATE_ACCOUNT)


      user.password = data.password;
      await user.save();

      return true
    }
    catch(e){
      throw new Error(e.message)
    }
  },

  userEdit : async (user, id) => {
    try{
      const Body = Object.keys(user)
      const Allowed = ['lastname','firstname','email','username','language']
      console.log('Verifying Req Body...')
      await utilities.bodyVerify(Allowed, Body, false)

      if(user.username || user.email){
        console.log(`Verifying if username: ${user.username} or email: ${user.email} exists in database`)
        const found = await userModel.findOne( { $or:[{username:user.username}, {email:user.email} ]})

        if(found && found.username == user.username && found._id != id.toString())
            // An account by same Username Already exists
            throw new Error(Dictionary().UNAME_AEXISTS)
        if(found && found.email == user.email && found._id != id.toString())
            // An account by same Email Already exists
            throw new Error(Dictionary().EMAIL_AEXISTS)
        console.log('A user by the same username or email does not exist...')
      }
      console.log('Updating User....')
      const newUser = await userModel.findByIdAndUpdate(id, user, { new: true, runValidators: true })
      if(!newUser)
        // throw new Error("Something Went Wrong, error: UE1")
        throw new Error(Dictionary().UE1)
      
      console.log('User was updated Successfully...')
      return newUser

      } catch(e){
        console.log(e.message)
            throw new Error(e.message)
        }
  },

  userChangePwd: async (data,id) => {
    try{
        const Body = Object.keys(data)

      const Allowed = ['old','new','confirm']
      // //// check every element of body if it has the allowed array elements returns false if one element doest correspond
      const isValidOperation = Body.every((element) => Allowed.includes(element))

      if(!isValidOperation)
           throw new Error(Dictionary().INVALID_OPERATION)
      if(Body.length != Allowed.length)
           throw new Error(Dictionary().ELMENTS_MISSING)

      await utilities.checkFormatPassword(data.old) && await utilities.checkFormatPassword(data.new) && await utilities.checkFormatPassword(data.confirm)

      if(data.new !== data.confirm)
           throw new Error(Dictionary().PASS_NOT_MATCH)
      // /// get user by id
      let user = await userModel.findById(id)
      if(!user) 
         throw new Error(Dictionary().USER_NOT_FOUND)
      else{      
        if(bcrypt.compareSync(data.old, user.password)){
          user.password = data.new;
          await user.save();
          console.log("password changed succesfully")
          return true
        }else{
          throw new Error(Dictionary().ERR_OLD_PASS)
        }
      }
    }
    catch(e){
      throw new Error(e.message)
    }
  },

  userAddPwd: async (data,id) => {
    try{
        const Body = Object.keys(data)

      const Allowed = ['new','confirm']
      // //// check every element of body if it has the allowed array elements returns false if one element doest correspond
      const isValidOperation = Body.every((element) => Allowed.includes(element))

      if(!isValidOperation)
           throw new Error(Dictionary().INVALID_OPERATION)
      if(Body.length != Allowed.length)
           throw new Error(Dictionary().ELMENTS_MISSING)

      await utilities.checkFormatPassword(data.new) && await utilities.checkFormatPassword(data.confirm)

      if(data.new !== data.confirm)
           throw new Error(Dictionary().PASS_NOT_MATCH)
      // /// get user by id
      let user = await userModel.findById(id)
      if(!user) 
         throw new Error(Dictionary().USER_NOT_FOUND)
      else{      
          user.password = data.new;
          await user.save();
          console.log("password changed succesfully")
          return true
      }
    }
    catch(e){
      throw new Error(e.message)
    }
  },

  userView: async (id) => {
    try{
      // /// get user by id
      const user = await userModel.findOne({_id:id.toString()})
      if(!user) 
         throw new Error(Dictionary().USER_NOT_FOUND)
      else{      
          console.log("user found!")
          return user
      }
    }
    catch(e){
      throw new Error(e.message)
    }
  },

  userUpdatePic: async (profileImg, id) => {
    try{
      if(!profileImg)
          throw new Error(Dictionary().INVALID_PICTURE_PATH)

      if(!id)
        throw new Error(Dictionary().SOMETHING_WENT_WRONG)


      const user = await userModel.findByIdAndUpdate(id, {profileImg}, { new: true, runValidators: true })
      if(!user) 
        throw new Error(Dictionary().USER_NOT_FOUND)

      return user
    }
    catch(e){
      throw new Error(e.message)
    }
  },

  userConfirm: async (token) => {
    try{
      if(!token)
          // invalid Token
          throw new Error(Dictionary().NOT_VALID_TOKEN)


      const user = await userModel.findOne({token})
      if(!user) 
        // User Not Found !
        throw new Error(Dictionary().USER_NOT_FOUND)
      
      if(!user.verified){
        user.verified = true
        await user.save()
      }
      else 
        // Account Already Confirmed
        throw new Error(Dictionary().ACCOUNT_ACONFIRMED)


      await  mailHandler.sendConfirmed(user.email, user.name)
      return true
    }
    catch(e){
      throw new Error(e.message)
    }
  },

  userSendForgot : async (body) => {
    try{
      if(!body.email)
          // Not a valid operation Element not Allowed
          throw new Error(Dictionary().INVALID_OPERATION)
      if(Object.keys(body).length != 1)
          // element(s) not Allowed
          throw new Error(Dictionary().ELEMENT_NOT_ALLOWED)

      const user = await userModel.findOne({email:body.email})
      if(!user) 
        // User Not Found
        throw new Error(Dictionary().USER_NOT_FOUND)

      if(!user.verified)
          // Activate Account first 
          throw new Error(Dictionary().ACTIVATE_ACCOUNT)

    
      user.token = Token.generate()
      await user.save()
      await  mailHandler.sendReset(user.email, user.token)
      return true
    }
    catch(e){
      throw new Error(e.message)
    }
  }
};

module.exports = User;
