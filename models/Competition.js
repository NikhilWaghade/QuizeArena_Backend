const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Competition title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Competition description is required'],
      trim: true
    },
    competitionCode: {
      type: String,
      required: [true, 'Competition code is required'],
      unique: true,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Competition date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    totalRounds: {
      type: Number,
      required: [true, 'Total rounds is required']
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions is required']
    },
    questionTimer: {
      type: Number,
      required: [true, 'Question timer (in seconds) is required'],
      default: 30
    },
    buzzerEnabled: {
      type: Boolean,
      default: false
    },
    leaderboardEnabled: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Live', 'Completed'],
      default: 'Upcoming'
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

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
