// ═══════════════════════════════════════════════════
//  controllers/api/apiAuthController.js
//  Handles POST /api/v1/auth/login
//  Returns JWT token on valid credentials
// ═══════════════════════════════════════════════════

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../../models/User');

// ── POST /api/v1/auth/login ────────────────────────
exports.apiLogin = async (req, res) => {
  const { email, password } = req.body;

  // ── 1. Validate input ─────────────────────────
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  try {
    // ── 2. Find user by email ──────────────────
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── 3. Compare password ────────────────────
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── 4. Sign JWT token ──────────────────────
    const token = jwt.sign(
      {
        user_id: user._id,
        role:    user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ── 5. Return token ────────────────────────
    return res.status(200).json({
      success: true,
      token,
    });

  } catch (err) {
    console.error('API Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};
