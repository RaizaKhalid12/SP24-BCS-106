// ═══════════════════════════════════════════════════
//  models/Product.js
//  Mongoose schema — mirrors your existing product
//  structure from routes/index.js
// ═══════════════════════════════════════════════════

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String,  required: true,  trim: true },
  price:    { type: Number,  required: true,  min: 0     },   // stored as number (e.g. 1250)
  category: {
    type: String,
    required: true,
    // Your existing tab keys mapped to assignment categories
    enum: ['New Launch', 'Hair Care', 'Skin Care', 'Skin Brightening', 'Serums', 'Moisturisers'],
  },
  rating:   { type: Number,  required: true,  min: 0, max: 5 },  // stars (1–5)
  reviews:  { type: Number,  required: true,  min: 0         },
  stock:    { type: Number,  required: true,  min: 0         },
  img1:     { type: String,  default: ''                     },  // primary image (path or filename)
  img2:     { type: String,  default: ''                     },  // hover image
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
