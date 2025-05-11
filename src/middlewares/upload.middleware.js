const multer = require("multer");
const path = require("path");

const type = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
          cb(null, "uploads/temp")
    },
    filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});


const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1 * 1024 * 1024, // 1 MB
  },
  fileFilter: (req, file, cb) => {
         if(!type.includes(file.mimetype)){
             return cb(new Error("Invalid file type"), false)
          }
          cb(null, true)
  }
})

module.exports = upload;