// ═══════════════════════════════════════════════════
//  seed.js  —  run once with:  node seed.js
//  Seeds MongoDB with YOUR existing Mazton products
//  (taken directly from Lab Task 2 routes/index.js)
// ═══════════════════════════════════════════════════

const mongoose = require('mongoose');
const Product  = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mazton';

// ── YOUR EXACT PRODUCTS from Lab Task 2 ────────────
// price is stored as a number so we can filter/sort it.
// img1/img2 are your existing filenames in /public/images/
const sampleProducts = [

  // ── New Launch ─────────────────────────────────
  {
    name: 'Lumexa Facewash',
    price: 1250, category: 'New Launch',
    rating: 5, reviews: 7, stock: 45,
    img1: 'LumexaFacewash1_medium.jpg', img2: 'LumexaFacewash2_medium.jpg',
  },
  {
    name: 'Mazclarity Micellar Foaming Facewash',
    price: 1798, category: 'New Launch',
    rating: 5, reviews: 6, stock: 30,
    img1: 'MazClarity.jpeg', img2: 'MazClarity2.jpeg',
  },
  {
    name: 'Sunpro Tinted Sunscreen SPF 50 PA+++',
    price: 1798, category: 'New Launch',
    rating: 4, reviews: 83, stock: 60,
    img1: 'SunPro.jpeg', img2: 'SunPro2.jpeg',
  },
  {
    name: 'Metafil Hydrating Serum',
    price: 2100, category: 'New Launch',
    rating: 5, reviews: 12, stock: 25,
    img1: 'MetafilSerum.jpeg', img2: 'MetafilSerum2.jpeg',
  },

  // ── Hair Care ──────────────────────────────────
  {
    name: 'FolioBoost Hair Serum',
    price: 899, category: 'Hair Care',
    rating: 5, reviews: 34, stock: 50,
    img1: 'FolioBoost.jpg', img2: 'FolioBoost2.jpg',
  },
  {
    name: 'FolioBoost Deep Nourish Hair Mask',
    price: 1100, category: 'Hair Care',
    rating: 4, reviews: 19, stock: 35,
    img1: 'FolioBoost.jpg', img2: 'FolioBoost2.jpg',
  },

  // ── Skin Care ──────────────────────────────────
  {
    name: 'Metafil OS (Oily Skin) Cleanser',
    price: 1150, category: 'Skin Care',
    rating: 5, reviews: 27, stock: 40,
    img1: 'metafil-os.jpg', img2: 'metafil-os2.jpg',
  },
  {
    name: 'Metafil Gentle Skin Cleanser',
    price: 1050, category: 'Skin Care',
    rating: 4, reviews: 15, stock: 55,
    img1: 'metafil-gentle.jpg', img2: 'metafil-gentle2.jpg',
  },
  {
    name: 'Mazclarity Anti Acne Cream',
    price: 998, category: 'Skin Care',
    rating: 4, reviews: 22, stock: 48,
    img1: 'mazclarity-acne.jpg', img2: 'mazclarity-acne2.jpg',
  },
  {
    name: 'ScBlock Daily SPF Moisturiser',
    price: 1350, category: 'Skin Care',
    rating: 5, reviews: 38, stock: 32,
    img1: 'ScBlock.jpg', img2: 'ScBlock2.jpeg',
  },

  // ── Skin Brightening ───────────────────────────
  {
    name: 'Lumexa Brightening Gel',
    price: 2298, category: 'Skin Brightening',
    rating: 5, reviews: 44, stock: 28,
    img1: 'Lumexa-Brightening-Gel.jpg', img2: 'Lumexa-Brightening-Gel2.jpg',
  },
  {
    name: 'Lumexa Skin Brightening Serum',
    price: 2000, category: 'Skin Brightening',
    rating: 5, reviews: 31, stock: 22,
    img1: 'Lumexa-Skin-Brightening-Serum.jpg', img2: 'Lumexa-Skin-Brightening-Serum2.jpg',
  },
  {
    name: 'MazClarity Brightening Facewash',
    price: 1798, category: 'Skin Brightening',
    rating: 4, reviews: 18, stock: 40,
    img1: 'MazClarity.jpeg', img2: 'MazClarity2.jpeg',
  },

  // ── Serums ─────────────────────────────────────
  {
    name: 'Metafil Hydrating Serum 30ml',
    price: 2100, category: 'Serums',
    rating: 5, reviews: 12, stock: 25,
    img1: 'MetafilSerum.jpeg', img2: 'MetafilSerum2.jpeg',
  },
  {
    name: 'FolioBoost Scalp & Hair Serum',
    price: 899, category: 'Serums',
    rating: 4, reviews: 22, stock: 50,
    img1: 'FolioBoost.jpg', img2: 'FolioBoost2.jpg',
  },
  {
    name: 'Lumexa Vitamin C Brightening Serum',
    price: 2000, category: 'Serums',
    rating: 5, reviews: 31, stock: 18,
    img1: 'Lumexa-Skin-Brightening-Serum.jpg', img2: 'Lumexa-Skin-Brightening-Serum2.jpg',
  },

  // ── Moisturisers ───────────────────────────────
  {
    name: 'Metafil Moisturising Cream',
    price: 750, category: 'Moisturisers',
    rating: 5, reviews: 58, stock: 70,
    img1: 'metafil-moisturising.jpg', img2: 'metafil-moisturising2.jpg',
  },
  {
    name: 'ScBlock SPF 30 Daily Moisturiser',
    price: 1350, category: 'Moisturisers',
    rating: 5, reviews: 23, stock: 45,
    img1: 'ScBlock.jpg', img2: 'ScBlock2.jpeg',
  },
  {
    name: 'Lumexa Deep Hydration Night Cream',
    price: 1600, category: 'Moisturisers',
    rating: 4, reviews: 15, stock: 30,
    img1: 'Lumexa-Brightening-Gel.jpg', img2: 'Lumexa-Brightening-Gel2.jpg',
  },
  {
    name: 'Metafil Oil-Free Gel Moisturiser',
    price: 1100, category: 'Moisturisers',
    rating: 5, reviews: 41, stock: 55,
    img1: 'metafil-gentle.jpg', img2: 'metafil-gentle2.jpg',
  },
  {
    name: 'Mazclarity Hydra-Barrier Cream',
    price: 1450, category: 'Moisturisers',
    rating: 4, reviews: 17, stock: 38,
    img1: 'MazClarity.jpeg', img2: 'MazClarity2.jpeg',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️   Cleared old products');

    await Product.insertMany(sampleProducts);
    console.log(`🌱  Inserted ${sampleProducts.length} Mazton products`);

    await mongoose.disconnect();
    console.log('🔌  Done! Run: npm run dev');
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seed();

