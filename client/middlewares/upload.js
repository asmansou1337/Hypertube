const multer = require('multer')
const Dictionary = require('../libraries/dictionary')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    }
});
const upload = multer({
    limits: {
      fileSize: 5000000
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png)$/)){
        req.fileValidationError = Dictionary().FILE_EXT_ERROR
        return cb(new Error(Dictionary().FILE_EXT_ERROR));
      }
      if (!file.mimetype === "image/jpeg" || !file.mimetype === "image/jpg" || !file.mimetype === "image/png"){
        req.fileValidationError = Dictionary().FILE_ERROR 
        return cb(new Error(Dictionary().FILE_ERROR ));
      }
       
      cb(undefined, true);
    },
    storage: storage
  }).single('profile')


const uploadFile = async (req, res, next)=>{
    upload(req, res, function(err) {
    if (req.fileValidationError) {
        req.fileError = req.fileValidationError
        // return res.redirect('/editProfile?error=' + req.fileValidationError)
    }
    else if (!req.file) {
        req.fileError = Dictionary().SELECT_PICTURE
        // return res.redirect('/editProfile?error=select image')
    }
    else if (err instanceof multer.MulterError) {
        req.fileError = err
        // return res.redirect('/editProfile?error=' + err)
    }
    else if (err) {
        req.fileError = err
        // return res.redirect('/editProfile?error=' + err)
    }
    next()
})
}
// multer settings

  module.exports = uploadFile