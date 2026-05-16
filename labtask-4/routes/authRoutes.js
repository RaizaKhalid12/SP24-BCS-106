// ═══════════════════════════════════════════════════
//  routes/authRoutes.js
//  /register  /login  /logout  /profile
// ═══════════════════════════════════════════════════

const express    = require('express');
const router     = express.Router();
const authCtrl   = require('../controllers/authController');
const { isLoggedIn } = require('../middleware/auth');

// Register
router.get('/register',  authCtrl.getRegister);
router.post('/register', authCtrl.postRegister);

// Login
router.get('/login',  authCtrl.getLogin);
router.post('/login', authCtrl.postLogin);

// Logout
router.get('/logout', authCtrl.getLogout);

// Profile (protected — must be logged in)
router.get('/profile', isLoggedIn, authCtrl.getProfile);

module.exports = router;
