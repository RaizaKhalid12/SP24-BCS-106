// ═══════════════════════════════════════════════════
//  routes/api/userApiRoutes.js
//  Protected (JWT):
//    GET /api/v1/user/profile   — current user data
// ═══════════════════════════════════════════════════

const express       = require('express');
const router        = express.Router();
const verifyToken   = require('../../middleware/verifyToken');
const apiUserCtrl   = require('../../controllers/api/apiUserController');

// GET /api/v1/user/profile  (JWT required)
router.get('/profile', verifyToken, apiUserCtrl.getProfile);

module.exports = router;
