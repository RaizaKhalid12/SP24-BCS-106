// ═══════════════════════════════════════════════════
//  routes/index.js
//  All page routes for Mazton Skin Solutions
// ═══════════════════════════════════════════════════

const express = require('express');
const router  = express.Router();

// ── Product data — in a real app this would come from a DB ──
const products = {
  'new-launch': [
    { name: 'Lumexa Facewash',                    price: 'RS.1,250.00', stars: 5, reviews: 7,  img1: 'LumexaFacewash1_medium.jpg', img2: 'LumexaFacewash2_medium.jpg' },
    { name: 'Mazclarity Micellar Foaming Facewash',price: 'RS.1,798.00', stars: 5, reviews: 6,  img1: 'MazClarity.jpeg',            img2: 'MazClarity2.jpeg' },
    { name: 'Sunpro Tinted Sunscreen SPF 50 PA+++',price: 'RS.1,798.00', stars: 4, reviews: 83, img1: 'SunPro.jpeg',               img2: 'SunPro2.jpeg' },
    { name: 'Metafil Hydrating Serum',             price: 'RS.2,100.00', stars: 5, reviews: 12, img1: 'MetafilSerum.jpeg',          img2: 'MetafilSerum2.jpeg' },
  ],
  'hair-care': [
    { name: 'FolioBoost Hair Serum',   price: 'RS.899.00',   stars: 5, reviews: 34, img1: 'FolioBoost.jpg',  img2: 'FolioBoost2.jpg' },
    { name: 'Deep Nourish Hair Mask',  price: 'RS.1,100.00', stars: 4, reviews: 19, img1: 'hair2.jpg',       img2: 'hair2b.jpg' },
  ],
  'skin-care': [
    { name: 'Metafil OS (Oily Skin) Cleanser', price: 'RS.1,150.00', stars: 5, reviews: 27, img1: 'metafil-os.jpg',     img2: 'metafil-os2.jpg' },
    { name: 'Metafil Gentle Skin Cleanser',    price: 'RS.1,050.00', stars: 4, reviews: 15, img1: 'metafil-gentle.jpg', img2: 'metafil-gentle2.jpg' },
  ],
  'skin-brightening': [
    { name: 'Lumexa Brightening Gel',        price: 'RS.2,298.00', stars: 5, reviews: 44, img1: 'Lumexa-Brightening-Gel.jpg',        img2: 'Lumexa-Brightening-Gel2.jpg' },
    { name: 'Lumexa Skin Brightening Serum', price: 'RS.2,000.00', stars: 5, reviews: 31, img1: 'Lumexa-Skin-Brightening-Serum.jpg', img2: 'Lumexa-Skin-Brightening-Serum2.jpg' },
  ],
  'serums': [
    { name: 'Metafil Hydrating Serum', price: 'RS.2,100.00', stars: 5, reviews: 12, img1: 'MetafilSerum.jpeg', img2: 'MetafilSerum2.jpeg' },
    { name: 'Folio Boost Serum',       price: 'RS.899.00',   stars: 4, reviews: 22, img1: 'FolioBoost.jpg',   img2: 'FolioBoost2.jpg' },
  ],
  'moisturisers': [
    { name: 'Metafil Moisturising Cream',  price: 'RS.750.00',   stars: 5, reviews: 58, img1: 'metafil-moisturising.jpg', img2: 'metafil-moisturising2.jpg' },
    { name: 'SPF 30 Daily Moisturiser',    price: 'RS.1,350.00', stars: 5, reviews: 23, img1: 'moist2.jpg',               img2: 'moist2b.jpg' },
    { name: 'Deep Hydration Night Cream',  price: 'RS.1,600.00', stars: 4, reviews: 15, img1: 'moist3.jpg',               img2: 'moist3b.jpg' },
    { name: 'Oil-Free Gel Moisturiser',    price: 'RS.1,100.00', stars: 5, reviews: 41, img1: 'moist4.jpg',               img2: 'moist4b.jpg' },
  ],
};

const bestSellers = [
  { name: 'Metafil OS (Oily Skin) Cleanser', price: 'RS.1,150.00', img1: 'metafil-os.jpg',                     img2: 'metafil-os2.jpg' },
  { name: 'Metafil Moisturising Cream',       price: 'RS.750.00',   img1: 'metafil-moisturising.jpg',           img2: 'metafil-moisturising2.jpg' },
  { name: 'Metafil Gentle Skin Cleanser',     price: 'RS.1,050.00', img1: 'metafil-gentle.jpg',                 img2: 'metafil-gentle2.jpg' },
  { name: 'Mazclarity Anti Acne Cream',       price: 'RS.998.00',   img1: 'mazclarity-acne.jpg',                img2: 'mazclarity-acne2.jpg' },
  { name: 'Lumexa Brightening Gel',           price: 'RS.2,298.00', img1: 'Lumexa-Brightening-Gel.jpg',        img2: 'Lumexa-Brightening-Gel2.jpg' },
  { name: 'Folio Boost Serum',                price: 'RS.899.00',   img1: 'FolioBoost.jpg',                     img2: 'FolioBoost2.jpg' },
  { name: 'Lumexa Skin Brightening Serum',    price: 'RS.2,000.00', img1: 'Lumexa-Skin-Brightening-Serum.jpg', img2: 'Lumexa-Skin-Brightening-Serum2.jpg' },
];

// ── HOME PAGE ──────────────────────────────────────
router.get('/', (req, res) => {
  res.render('index', {
    title:       'Mazton Skin Solutions',
    products,
    bestSellers,
    // duplicate best sellers for seamless infinite reel
    reelItems:   [...bestSellers, ...bestSellers],
    activeTab:   'new-launch',
  });
});

// ── OPTIONAL: individual category pages via query ──
// e.g. /?tab=serums  (the main page JS handles tabs,
// but this lets the server know which tab is active)
router.get('/category/:tab', (req, res) => {
  const tab  = req.params.tab;
  const list = products[tab];
  if (!list) return res.redirect('/');
  res.render('index', {
    title:      `Mazton – ${tab.replace(/-/g, ' ')}`,
    products,
    bestSellers,
    reelItems:  [...bestSellers, ...bestSellers],
    activeTab:  tab,
  });
});

module.exports = router;
