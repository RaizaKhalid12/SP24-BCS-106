// ═══════════════════════════════════════════════════
//  routes/api/productApiRoutes.js
//  Public:
//    GET /api/v1/products        — list with filters
//    GET /api/v1/products/:id    — single product
// ═══════════════════════════════════════════════════

const express          = require('express');
const router           = express.Router();
const apiProductCtrl   = require('../../controllers/api/apiProductController');

// GET /api/v1/products
// Supports: ?page, ?search, ?category, ?min, ?max, ?sort
router.get('/', apiProductCtrl.getApiProducts);

// GET /api/v1/products/:id
router.get('/:id', apiProductCtrl.getApiProductById);

module.exports = router;
