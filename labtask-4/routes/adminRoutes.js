// ═══════════════════════════════════════════════════
//  routes/adminRoutes.js
//  All /admin routes — now protected by isAdmin
//  (role-based auth from middleware/auth.js)
// ═══════════════════════════════════════════════════

const express    = require('express');
const router     = express.Router();
const adminCtrl  = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');   // ← NEW role-based guard
const upload     = require('../middleware/upload');

// ── All admin routes require admin role ────────────
router.use(isAdmin);

// Dashboard
router.get('/', adminCtrl.getDashboard);

// Create product
router.get('/products/new',         adminCtrl.getNewProduct);
router.post('/products/new',        upload.single('image'), adminCtrl.postNewProduct);

// Edit product
router.get('/products/edit/:id',    adminCtrl.getEditProduct);
router.post('/products/edit/:id',   upload.single('image'), adminCtrl.postEditProduct);

// Delete product
router.post('/products/delete/:id', adminCtrl.deleteProduct);

module.exports = router;
