// ═══════════════════════════════════════════════════
//  middleware/verifyToken.js
//  JWT authentication middleware for /api/v1 routes
//  ─────────────────────────────────────────────────
//  Reads:   Authorization: Bearer <token>
//  Attaches decoded payload to req.user
//  Returns: 401 if no token, 403 if invalid/expired
// ═══════════════════════════════════════════════════

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // ── 1. Read Authorization header ──────────────
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided. Use: Authorization: Bearer <token>',
    });
  }

  // ── 2. Extract token after "Bearer " ──────────
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Token is missing.',
    });
  }

  // ── 3. Verify token ───────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, role, iat, exp }
    next();
  } catch (err) {
    // Token is expired or tampered
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
}

module.exports = verifyToken;
