const School = require('../models/School');

/**
 * @desc    Create a new school
 * @route   POST /api/schools
 * @access  Private
 */
const createSchool = async (req, res) => {
  try {
    const { name, code, principalName, email, phone, address, city, state, status } = req.body;

    // Validate presence of required fields
    if (!name || !code || !principalName || !email || !phone || !address || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        error: {}
      });
    }

    // Check if school code is unique
    const codeExists = await School.findOne({ code });
    if (codeExists) {
      return res.status(400).json({
        success: false,
        message: `School with code '${code}' already exists`,
        error: {}
      });
    }

    const school = new School({
      name,
      code,
      principalName,
      email,
      phone,
      address,
      city,
      state,
      status: status || 'Active',
      createdBy: req.user._id
    });

    const savedSchool = await school.save();

    return res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: savedSchool
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating school',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get all schools
 * @route   GET /api/schools
 * @access  Private
 */
const getSchools = async (req, res) => {
  try {
    const schools = await School.find({}).populate('createdBy', 'name email');
    return res.status(200).json({
      success: true,
      message: 'Schools fetched successfully',
      data: schools
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching schools',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Get single school by ID
 * @route   GET /api/schools/:id
 * @access  Private
 */
const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate('createdBy', 'name email');
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
        error: {}
      });
    }

    return res.status(200).json({
      success: true,
      message: 'School fetched successfully',
      data: school
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching school details',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Update a school
 * @route   PUT /api/schools/:id
 * @access  Private
 */
const updateSchool = async (req, res) => {
  try {
    const { name, code, principalName, email, phone, address, city, state, status } = req.body;

    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
        error: {}
      });
    }

    // Check code uniqueness if changing
    if (code && code !== school.code) {
      const codeExists = await School.findOne({ code });
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: `School with code '${code}' already exists`,
          error: {}
        });
      }
      school.code = code;
    }

    school.name = name || school.name;
    school.principalName = principalName || school.principalName;
    school.email = email || school.email;
    school.phone = phone || school.phone;
    school.address = address || school.address;
    school.city = city || school.city;
    school.state = state || school.state;
    school.status = status || school.status;

    const updatedSchool = await school.save();

    return res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: updatedSchool
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating school',
      error: { message: error.message }
    });
  }
};

/**
 * @desc    Delete a school
 * @route   DELETE /api/schools/:id
 * @access  Private
 */
const deleteSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found',
        error: {}
      });
    }

    await school.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'School deleted successfully',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting school',
      error: { message: error.message }
    });
  }
};

module.exports = {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
};
