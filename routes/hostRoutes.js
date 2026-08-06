const express = require('express');
const router = express.Router();
const {
  startCompetition,
  startRound,
  nextQuestion,
  previousQuestion,
  pauseTimer,
  resumeTimer,
  showAnswer,
  endCompetition
} = require('../controllers/hostController');
const { protect } = require('../middleware/authMiddleware');

// Secure all host administration routes
router.use(protect);

router.post('/start', startCompetition);
router.post('/start-round', startRound);
router.post('/next-question', nextQuestion);
router.post('/previous-question', previousQuestion);
router.post('/pause-timer', pauseTimer);
router.post('/resume-timer', resumeTimer);
router.post('/show-answer', showAnswer);
router.post('/end', endCompetition);

module.exports = router;
