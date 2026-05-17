// ═══════════════════════════════════════════════════
//  routes/products.js
//  Mounts product catalog routes
// ═══════════════════════════════════════════════════

const express           = require('express');
const router            = express.Router();
const productController = require('../controllers/productController');

// GET /products — catalog with search, filter, sort, pagination
router.get('/', productController.getProducts);

module.exports = router;
