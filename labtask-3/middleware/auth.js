// ═══════════════════════════════════════════════════
//  middleware/auth.js
//  isLoggedIn — protect routes from guests
//  isAdmin    — protect routes from non-admin users
// ═══════════════════════════════════════════════════

// Allow access only to logged-in users
function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to access that page.');
  res.redirect('/login');
}

// Allow access only to admin users
function isAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  req.flash('error', 'Access Denied. Admins only.');
  res.redirect('/');
}

module.exports = { isLoggedIn, isAdmin };
