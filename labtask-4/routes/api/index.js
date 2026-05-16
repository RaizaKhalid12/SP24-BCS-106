// ═══════════════════════════════════════════════════
//  routes/api/index.js
//  Mounts all /api/v1 sub-routes
//  ─────────────────────────────────────────────────
//  PUBLIC:
//    POST /api/v1/auth/login
//    GET  /api/v1/products
//    GET  /api/v1/products/:id
//
//  PROTECTED (JWT required):
//    POST /api/v1/orders
//    GET  /api/v1/user/profile
// ═══════════════════════════════════════════════════

const express        = require('express');
const router         = express.Router();

const authApiRoutes    = require('./authApiRoutes');
const productApiRoutes = require('./productApiRoutes');
const orderApiRoutes   = require('./orderApiRoutes');
const userApiRoutes    = require('./userApiRoutes');

// ── Mount sub-routes ───────────────────────────────
router.use('/auth',     authApiRoutes);       // /api/v1/auth/login
router.use('/products', productApiRoutes);    // /api/v1/products  /api/v1/products/:id
router.use('/orders',   orderApiRoutes);      // /api/v1/orders
router.use('/user',     userApiRoutes);       // /api/v1/user/profile

// ── API root info ──────────────────────────────────
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mazton Skin Solutions API v1',
    endpoints: {
      public: [
        'POST /api/v1/auth/login',
        'GET  /api/v1/products',
        'GET  /api/v1/products/:id',
      ],
      protected: [
        'POST /api/v1/orders          (Authorization: Bearer <token>)',
        'GET  /api/v1/user/profile    (Authorization: Bearer <token>)',
      ],
    },
    filters: {
      products: '?page=1 &search= &category= &min= &max= &sort=price_asc|price_desc|rating_desc',
    },
  });
});

module.exports = router;
