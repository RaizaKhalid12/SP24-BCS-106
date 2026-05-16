// ═══════════════════════════════════════════════════
//  routes/adminRoutes.js
//  All /admin routes — protected by requireAdmin
// ═══════════════════════════════════════════════════

const express        = require('express');
const router         = express.Router();
const adminCtrl      = require('../controllers/adminController');
const { requireAdmin, handleLogin } = require('../middleware/adminAuth');
const upload         = require('../middleware/upload');

// ── Public admin routes (no auth needed) ──────────
router.get('/login',  adminCtrl.getLogin);
router.post('/login', handleLogin);
router.get('/logout', adminCtrl.getLogout);

// ── All routes below require admin session ─────────
router.use(requireAdmin);

// Dashboard
router.get('/', adminCtrl.getDashboard);

// Create product
router.get('/products/new',            adminCtrl.getNewProduct);
router.post('/products/new',           upload.single('image'), adminCtrl.postNewProduct);

// Edit product
router.get('/products/edit/:id',       adminCtrl.getEditProduct);
router.post('/products/edit/:id',      upload.single('image'), adminCtrl.postEditProduct);

// Delete product
router.post('/products/delete/:id',    adminCtrl.deleteProduct);

module.exports = router;
