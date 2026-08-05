const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        error: {}
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // If user doesn't exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: {}
      });
    }

    // Compare password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: {}
      });
    }

    // Generate JWT using generateToken
    const token = generateToken(user._id);

    // Prepare user object without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userResponse
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in loginUser controller',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // Skeleton implementation
    return res.status(200).json({
      success: true,
      message: 'Get profile route skeleton (logic not implemented)',
      data: req.user || {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in getProfile controller',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = async (req, res) => {
  try {
    // Skeleton implementation
    return res.status(200).json({
      success: true,
      message: 'Logout route skeleton (logic not implemented)',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in logoutUser controller',
      error: { message: error.message }
    });
  }
};

module.exports = {
  loginUser,
  getProfile,
  logoutUser
};
