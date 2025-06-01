const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.split('.').pop().toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File type not supported. Please upload JPEG, PNG, or MP4 files.'));
  },
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// Skip OPTIONS requests
const skipOptions = (middleware) => (req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Skipping upload middleware for OPTIONS request');
    return next();
  }
  middleware(req, res, next);
};

module.exports = skipOptions(upload);