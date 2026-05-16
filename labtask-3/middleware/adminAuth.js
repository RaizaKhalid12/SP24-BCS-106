// ═══════════════════════════════════════════════════
//  middleware/adminAuth.js
//  Basic admin protection — checks session flag set
//  after password entry at /admin/login
// ═══════════════════════════════════════════════════

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mazton2024';

// Protect all /admin routes (except login itself)
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
}

// Handle login form submission
function handleLogin(req, res) {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('admin/login', {
      title: 'Admin Login – Mazton',
      error: 'Incorrect password. Please try again.',
    });
  }
}

module.exports = { requireAdmin, handleLogin, ADMIN_PASSWORD };
