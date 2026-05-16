// ═══════════════════════════════════════════════════
//  routes/api/orderApiRoutes.js
//  Protected (JWT):
//    POST /api/v1/orders    — create order
// ═══════════════════════════════════════════════════

const express        = require('express');
const router         = express.Router();
const verifyToken    = require('../../middleware/verifyToken');
const apiOrderCtrl   = require('../../controllers/api/apiOrderController');

// POST /api/v1/orders  (JWT required)
router.post('/', verifyToken, apiOrderCtrl.createOrder);

module.exports = router;
