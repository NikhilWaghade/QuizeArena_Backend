const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes by verifying JWT in the Authorization header.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token, excluding the password field, and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: { message: error.message }
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      error: {}
    });
  }
};

module.exports = {
  protect
};
