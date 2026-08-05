const Competition = require('../models/Competition');

/**
 * @desc    Create a new competition
 * @route   POST /api/competitions
 * @access  Private
 */
const createCompetition = async (req, res) => {
  try {
    const {
      title,
      description,
      competitionCode,
      date,
      startTime,
      endTime,
      totalRounds,
      totalQuestions,
      questionTimer,
      buzzerEnabled,
      leaderboardEnabled,
      status
    } = req.body;

    // Validate presence of required fields
    if (
      !title ||
      !description ||
      !competitionCode ||
      !date ||
      !startTime ||
      !endTime ||
      totalRounds === undefined ||
      totalQuestions === undefined ||
      questionTimer === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
        error: {}
      });
    }

    // Check if competition code is unique
    const codeExists = await Competition.findOne({ competitionCode });
    if (codeExists) {
      return res.status(400).json({
        success: false,
        message: `Competition with code '${competitionCode}' already exists`,
        error: {}
      });
    }

    const competition = new Competition({
      title,
      description,
      competitionCode,
      date,
      startTime,
      endTime,
      totalRounds,
      totalQuestions,
      questionTimer,
      buzzerEnabled: buzzerEnabled !== undefined ? buzzerEnabled : false,
      leaderboardEnabled: leaderboardEnabled !== undefined ? leaderboardEnabled : true,
      status: status || 'Upcoming',
      createdBy: req.user._id
    });

    const savedCompetition = await competition.save();

    return res.status(201).json({
      success: true,
      message: 'Competition created successfully',
      data: savedCompetition
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating competition',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get all competitions
 * @route   GET /api/competitions
 * @access  Private
 */
const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({})
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Competitions fetched successfully',
      data: competitions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching competitions',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get single competition by ID
 * @route   GET /api/competitions/:id
 * @access  Private
 */
const getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found',
        error: {}
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Competition fetched successfully',
      data: competition
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching competition details',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Update a competition
 * @route   PUT /api/competitions/:id
 * @access  Private
 */
const updateCompetition = async (req, res) => {
  try {
    const {
      title,
      description,
      competitionCode,
      date,
      startTime,
      endTime,
      totalRounds,
      totalQuestions,
      questionTimer,
      buzzerEnabled,
      leaderboardEnabled,
      status
    } = req.body;

    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found',
        error: {}
      });
    }

    // Check code uniqueness if changing
    if (competitionCode && competitionCode !== competition.competitionCode) {
      const codeExists = await Competition.findOne({ competitionCode });
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: `Competition with code '${competitionCode}' already exists`,
          error: {}
        });
      }
      competition.competitionCode = competitionCode;
    }

    competition.title = title || competition.title;
    competition.description = description || competition.description;
    competition.date = date || competition.date;
    competition.startTime = startTime || competition.startTime;
    competition.endTime = endTime || competition.endTime;
    competition.totalRounds = totalRounds !== undefined ? totalRounds : competition.totalRounds;
    competition.totalQuestions = totalQuestions !== undefined ? totalQuestions : competition.totalQuestions;
    competition.questionTimer = questionTimer !== undefined ? questionTimer : competition.questionTimer;
    competition.buzzerEnabled = buzzerEnabled !== undefined ? buzzerEnabled : competition.buzzerEnabled;
    competition.leaderboardEnabled = leaderboardEnabled !== undefined ? leaderboardEnabled : competition.leaderboardEnabled;
    competition.status = status || competition.status;

    const updatedCompetition = await competition.save();

    return res.status(200).json({
      success: true,
      message: 'Competition updated successfully',
      data: updatedCompetition
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating competition',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Delete a competition
 * @route   DELETE /api/competitions/:id
 * @access  Private
 */
const deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found',
        error: {}
      });
    }

    await competition.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Competition deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting competition',
      error: { message: error.message }
    });
  }
};

module.exports = {
  createCompetition,
  getCompetitions,
  getCompetitionById,
  updateCompetition,
  deleteCompetition
};
