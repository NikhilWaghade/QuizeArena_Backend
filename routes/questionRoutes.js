const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all question endpoints
router.use(protect);

router.route('/')
  .post(createQuestion)
  .get(getQuestions);

router.route('/:id')
  .get(getQuestionById)
  .put(updateQuestion)
  .delete(deleteQuestion);

module.exports = router;
