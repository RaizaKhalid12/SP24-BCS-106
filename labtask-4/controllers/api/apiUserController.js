// ═══════════════════════════════════════════════════
//  controllers/api/apiUserController.js
//  Handles GET /api/v1/user/profile (JWT protected)
//  Returns current user data from decoded token
// ═══════════════════════════════════════════════════

const User = require('../../models/User');

// ── GET /api/v1/user/profile ───────────────────────
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const user = await User
      .findById(req.user.user_id)
      .select('-password')   // never return the hashed password
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. The account may have been deleted.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    console.error('API Profile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile.',
    });
  }
};
