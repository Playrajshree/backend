const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'upload',
    format: async (req, file) => 'png',
    //   Multipurpose Internet Mail Extensions
    public_id: (req, file) => file.originalname + '-' + Date.now(),
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileFormats = ['image/jpeg', 'image/png'];
    if (!fileFormats.includes(file.mimetype)) {
      cb(new Error('Invalid format', false));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

module.exports = upload;
