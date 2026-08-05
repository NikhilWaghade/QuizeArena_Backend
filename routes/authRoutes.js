const express = require('express');
const router = express.Router();
const { loginUser, getProfile, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Route for user login
router.post('/login', loginUser);

// Route to get user profile (protected)
router.get('/profile', protect, getProfile);

// Route to log out user (protected)
router.post('/logout', protect, logoutUser);

module.exports = router;
