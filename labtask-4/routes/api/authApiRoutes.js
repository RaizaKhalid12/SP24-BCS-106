// ═══════════════════════════════════════════════════
//  routes/api/authApiRoutes.js
//  Public:   POST /api/v1/auth/login
// ═══════════════════════════════════════════════════

const express        = require('express');
const router         = express.Router();
const apiAuthCtrl    = require('../../controllers/api/apiAuthController');

// POST /api/v1/auth/login
router.post('/login', apiAuthCtrl.apiLogin);

module.exports = router;
