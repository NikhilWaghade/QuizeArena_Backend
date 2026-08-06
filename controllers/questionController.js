const Question = require('../models/Question');
const Competition = require('../models/Competition');

/**
 * @desc    Create a new question
 * @route   POST /api/questions
 * @access  Private
 */
const createQuestion = async (req, res) => {
  try {
    const {
      competition,
      roundNumber,
      questionText,
      options,
      correctAnswer,
      marks,
      negativeMarks,
      difficulty,
      category,
      timeLimit,
      status
    } = req.body;

    // Validate presence of required fields
    if (
      !competition ||
      roundNumber === undefined ||
      !questionText ||
      !options ||
      !options.A ||
      !options.B ||
      !options.C ||
      !options.D ||
      !correctAnswer ||
      marks === undefined ||
      !difficulty ||
      !category ||
      timeLimit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
        error: {}
      });
    }

    // Verify competition exists
    const competitionExists = await Competition.findById(competition);
    if (!competitionExists) {
      return res.status(404).json({
        success: false,
        message: 'Associated competition not found',
        error: {}
      });
    }

    // Check that roundNumber is within competition's totalRounds
    if (roundNumber > competitionExists.totalRounds) {
      return res.status(400).json({
        success: false,
        message: `Round number ${roundNumber} exceeds the competition's total rounds (${competitionExists.totalRounds})`,
        error: {}
      });
    }

    const question = new Question({
      competition,
      roundNumber,
      questionText,
      options,
      correctAnswer,
      marks,
      negativeMarks: negativeMarks !== undefined ? negativeMarks : 0,
      difficulty,
      category,
      timeLimit,
      status: status || 'Active',
      createdBy: req.user._id
    });

    const savedQuestion = await question.save();

    // Populate competition title for immediate response data completeness
    const populatedQuestion = await Question.findById(savedQuestion._id)
      .populate('competition', 'title competitionCode')
      .populate('createdBy', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: populatedQuestion
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating question',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get all questions
 * @route   GET /api/questions
 * @access  Private
 */
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate('competition', 'title competitionCode')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Questions fetched successfully',
      data: questions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get single question by ID
 * @route   GET /api/questions/:id
 * @access  Private
 */
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('competition', 'title competitionCode')
      .populate('createdBy', 'name email');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        error: {}
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Question fetched successfully',
      data: question
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching question details',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Update a question
 * @route   PUT /api/questions/:id
 * @access  Private
 */
const updateQuestion = async (req, res) => {
  try {
    const {
      competition,
      roundNumber,
      questionText,
      options,
      correctAnswer,
      marks,
      negativeMarks,
      difficulty,
      category,
      timeLimit,
      status
    } = req.body;

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        error: {}
      });
    }

    // Verify competition if changed
    if (competition && competition.toString() !== question.competition.toString()) {
      const competitionExists = await Competition.findById(competition);
      if (!competitionExists) {
        return res.status(404).json({
          success: false,
          message: 'Associated competition not found',
          error: {}
        });
      }
      question.competition = competition;
    }

    // Check round number validation
    if (roundNumber !== undefined) {
      const currentCompId = competition || question.competition;
      const competitionObj = await Competition.findById(currentCompId);
      if (competitionObj && roundNumber > competitionObj.totalRounds) {
        return res.status(400).json({
          success: false,
          message: `Round number ${roundNumber} exceeds the competition's total rounds (${competitionObj.totalRounds})`,
          error: {}
        });
      }
      question.roundNumber = roundNumber;
    }

    if (questionText) question.questionText = questionText;
    if (options) {
      if (options.A) question.options.A = options.A;
      if (options.B) question.options.B = options.B;
      if (options.C) question.options.C = options.C;
      if (options.D) question.options.D = options.D;
    }
    if (correctAnswer) question.correctAnswer = correctAnswer;
    if (marks !== undefined) question.marks = marks;
    if (negativeMarks !== undefined) question.negativeMarks = negativeMarks;
    if (difficulty) question.difficulty = difficulty;
    if (category) question.category = category;
    if (timeLimit !== undefined) question.timeLimit = timeLimit;
    if (status) question.status = status;

    const updatedQuestion = await question.save();

    // Populate associations
    const populatedQuestion = await Question.findById(updatedQuestion._id)
      .populate('competition', 'title competitionCode')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: populatedQuestion
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating question',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Delete a question
 * @route   DELETE /api/questions/:id
 * @access  Private
 */
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        error: {}
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting question',
      error: { message: error.message }
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
};
