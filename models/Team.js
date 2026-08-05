const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required']
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true
    },
    teamCode: {
      type: String,
      required: [true, 'Team code is required'],
      unique: true,
      trim: true
    },
    captainName: {
      type: String,
      required: [true, 'Captain name is required'],
      trim: true
    },
    captainEmail: {
      type: String,
      required: [true, 'Captain email is required'],
      trim: true,
      lowercase: true
    },
    captainPhone: {
      type: String,
      required: [true, 'Captain phone number is required'],
      trim: true
    },
    members: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
