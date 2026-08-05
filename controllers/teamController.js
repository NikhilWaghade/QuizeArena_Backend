const Team = require('../models/Team');

/**
 * @desc    Create a new team
 * @route   POST /api/teams
 * @access  Private
 */
const createTeam = async (req, res) => {
  try {
    const { school, teamName, teamCode, captainName, captainEmail, captainPhone, members, status } = req.body;

    // Validate presence of required fields
    if (!school || !teamName || !teamCode || !captainName || !captainEmail || !captainPhone) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
        error: {}
      });
    }

    // Check if team code is unique
    const codeExists = await Team.findOne({ teamCode });
    if (codeExists) {
      return res.status(400).json({
        success: false,
        message: `Team with code '${teamCode}' already exists`,
        error: {}
      });
    }

    const team = new Team({
      school,
      teamName,
      teamCode,
      captainName,
      captainEmail,
      captainPhone,
      members: members || [],
      status: status || 'Active',
      createdBy: req.user._id
    });

    const savedTeam = await team.save();
    
    // Populate school details
    const populatedTeam = await Team.findById(savedTeam._id).populate('school');

    return res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: populatedTeam
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating team',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get all teams
 * @route   GET /api/teams
 * @access  Private
 */
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({})
      .populate('school')
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Teams fetched successfully',
      data: teams
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching teams',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get single team by ID
 * @route   GET /api/teams/:id
 * @access  Private
 */
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('school')
      .populate('createdBy', 'name email');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
        error: {}
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Team fetched successfully',
      data: team
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching team details',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Update a team
 * @route   PUT /api/teams/:id
 * @access  Private
 */
const updateTeam = async (req, res) => {
  try {
    const { school, teamName, teamCode, captainName, captainEmail, captainPhone, members, status } = req.body;

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
        error: {}
      });
    }

    // Check code uniqueness if changing
    if (teamCode && teamCode !== team.teamCode) {
      const codeExists = await Team.findOne({ teamCode });
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: `Team with code '${teamCode}' already exists`,
          error: {}
        });
      }
      team.teamCode = teamCode;
    }

    team.school = school || team.school;
    team.teamName = teamName || team.teamName;
    team.captainName = captainName || team.captainName;
    team.captainEmail = captainEmail || team.captainEmail;
    team.captainPhone = captainPhone || team.captainPhone;
    team.members = members || team.members;
    team.status = status || team.status;

    const updatedTeam = await team.save();
    const populatedTeam = await Team.findById(updatedTeam._id).populate('school');

    return res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: populatedTeam
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating team',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Delete a team
 * @route   DELETE /api/teams/:id
 * @access  Private
 */
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
        error: {}
      });
    }

    await team.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting team',
      error: { message: error.message }
    });
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};
