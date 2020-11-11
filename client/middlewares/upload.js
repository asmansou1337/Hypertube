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
      if (!file.originalname.match(/\.(jpeg|jpg)$/)){
        req.fileValidationError = Dictionary().FILE_EXT_ERROR
        return cb(new Error(Dictionary().FILE_EXT_ERROR));
      }
      if (!file.mimetype === "image/jpeg" || !file.mimetype === "image/jpg"){
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
    }
    else if (!req.file) {
        req.fileError = Dictionary().SELECT_PICTURE
    }
    else if (err instanceof multer.MulterError) {
        req.fileError = err
    }
    else if (err) {
        req.fileError = err
    }
    next()
})
}
// multer settings

  module.exports = uploadFile