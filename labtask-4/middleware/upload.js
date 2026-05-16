// ═══════════════════════════════════════════════════
//  middleware/upload.js
//  Multer configuration for product image uploads
//  Saves files to /public/uploads/
// ═══════════════════════════════════════════════════

const multer  = require('multer');
const path    = require('path');

// ── Storage: save to /public/uploads with original ext
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Prefix with timestamp to avoid name collisions
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  },
});

// ── File filter: images only
const fileFilter = function (req, file, cb) {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext     = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
