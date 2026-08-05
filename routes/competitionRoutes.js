const express = require('express');
const router = express.Router();
const {
  createCompetition,
  getCompetitions,
  getCompetitionById,
  updateCompetition,
  deleteCompetition
} = require('../controllers/competitionController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all competition endpoints
router.use(protect);

router.route('/')
  .post(createCompetition)
  .get(getCompetitions);

router.route('/:id')
  .get(getCompetitionById)
  .put(updateCompetition)
  .delete(deleteCompetition);

module.exports = router;
