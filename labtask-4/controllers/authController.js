// ═══════════════════════════════════════════════════
//  controllers/authController.js
//  Handles registration, login, and logout
// ═══════════════════════════════════════════════════

const bcrypt = require('bcryptjs');
const User   = require('../models/User');

// ── GET /register ──────────────────────────────────
exports.getRegister = (req, res) => {
  // If already logged in, redirect home
  if (req.session.userId) return res.redirect('/');

  res.render('auth/register', {
    title: 'Create Account – Mazton',
    old:   JSON.parse(req.flash('old')[0] || '{}'),
  });
};

// ── POST /register ─────────────────────────────────
exports.postRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Save form values so we can refill on error
  req.flash('old', JSON.stringify({ name, email }));

  // ── Validate ──
  if (!name || name.trim() === '') {
    req.flash('error', 'Name is required.');
    return res.redirect('/register');
  }
  if (!email || email.trim() === '') {
    req.flash('error', 'Email is required.');
    return res.redirect('/register');
  }
  if (!password || password.length < 6) {
    req.flash('error', 'Password must be at least 6 characters.');
    return res.redirect('/register');
  }
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/register');
  }

  try {
    // Check for existing email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/register');
    }

    // Hash password (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password: hashedPassword,
      role:     'customer',
    });

    req.flash('success', 'Account created! Please log in.');
    res.redirect('/login');

  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
};

// ── GET /login ─────────────────────────────────────
exports.getLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/');

  res.render('auth/login', {
    title: 'Login – Mazton',
    old:   JSON.parse(req.flash('old')[0] || '{}'),
  });
};

// ── POST /login ────────────────────────────────────
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  req.flash('old', JSON.stringify({ email }));

  if (!email || !password) {
    req.flash('error', 'Email and password are required.');
    return res.redirect('/login');
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // Compare password with stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // Set session
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    // Redirect admin to admin panel, customer to homepage
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.redirect('/');

  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
};

// ── GET /logout ────────────────────────────────────
exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

// ── GET /profile ───────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      req.session.destroy(() => res.redirect('/login'));
      return;
    }
    res.render('auth/profile', {
      title: 'My Account – Mazton',
      user,
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.redirect('/');
  }
};
