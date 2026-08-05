const express = require('express');
const router = express.Router();
const {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all school endpoints
router.use(protect);

router.route('/')
  .post(createSchool)
  .get(getSchools);

router.route('/:id')
  .get(getSchoolById)
  .put(updateSchool)
  .delete(deleteSchool);

module.exports = router;
