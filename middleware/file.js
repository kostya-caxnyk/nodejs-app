const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const alowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  cb(null, alowedTypes.includes(file.mimetype));
};

module.exports = multer({
  storage,
  fileFilter,
});
