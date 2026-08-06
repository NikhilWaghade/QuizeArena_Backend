const Competition = require('../models/Competition');

/**
 * Helper to validate competition ID and return the Competition document.
 */
const validateCompetition = async (competitionId, res) => {
  if (!competitionId) {
    res.status(400).json({
      success: false,
      message: 'Competition ID is required',
      error: {}
    });
    return null;
  }

  try {
    const competition = await Competition.findById(competitionId);
    if (!competition) {
      res.status(404).json({
        success: false,
        message: 'Competition not found',
        error: {}
      });
      return null;
    }
    return competition;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database error validating competition',
      error: { message: error.message }
    });
    return null;
  }
};

/**
 * @desc    Start a competition (Set status to 'Live')
 * @route   POST /api/host/start
 * @access  Private
 */
const startCompetition = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  try {
    competition.status = 'Live';
    await competition.save();
    return res.status(200).json({
      success: true,
      message: 'Competition started successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while starting competition',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Start a round inside a competition
 * @route   POST /api/host/start-round
 * @access  Private
 */
const startRound = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  return res.status(200).json({
    success: true,
    message: 'Round started successfully'
  });
};

/**
 * @desc    Transition to the next question
 * @route   POST /api/host/next-question
 * @access  Private
 */
const nextQuestion = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  return res.status(200).json({
    success: true,
    message: 'Transitioned to next question'
  });
};

/**
 * @desc    Recall the previous question
 * @route   POST /api/host/previous-question
 * @access  Private
 */
const previousQuestion = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  return res.status(200).json({
    success: true,
    message: 'Recalled previous question'
  });
};

/**
 * @desc    Pause the question timer
 * @route   POST /api/host/pause-timer
 * @access  Private
 */
const pauseTimer = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  return res.status(200).json({
    success: true,
    message: 'Timer paused'
  });
};

/**
 * @desc    Resume the question timer
 * @route   POST /api/host/resume-timer
 * @access  Private
 */
const resumeTimer = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  return res.status(200).json({
    success: true,
    message: 'Timer resumed'
  });
};

/**
 * @desc    Reveal answer key options
 * @route   POST /api/host/show-answer
 * @access  Private
 */
const showAnswer = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  return res.status(200).json({
    success: true,
    message: 'Answer revealed successfully'
  });
};

/**
 * @desc    End a competition (Set status to 'Completed')
 * @route   POST /api/host/end
 * @access  Private
 */
const endCompetition = async (req, res) => {
  const { competitionId } = req.body;
  const competition = await validateCompetition(competitionId, res);
  if (!competition) return;

  try {
    competition.status = 'Completed';
    await competition.save();
    return res.status(200).json({
      success: true,
      message: 'Competition ended successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while ending competition',
      error: { message: error.message }
    });
  }
};

module.exports = {
  startCompetition,
  startRound,
  nextQuestion,
  previousQuestion,
  pauseTimer,
  resumeTimer,
  showAnswer,
  endCompetition
};
