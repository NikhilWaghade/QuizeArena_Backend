const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: [true, 'Competition reference is required']
    },
    roundNumber: {
      type: Number,
      required: [true, 'Round number is required'],
      min: [1, 'Round number must be at least 1']
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    options: {
      A: {
        type: String,
        required: [true, 'Option A is required'],
        trim: true
      },
      B: {
        type: String,
        required: [true, 'Option B is required'],
        trim: true
      },
      C: {
        type: String,
        required: [true, 'Option C is required'],
        trim: true
      },
      D: {
        type: String,
        required: [true, 'Option D is required'],
        trim: true
      }
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
      enum: {
        values: ['A', 'B', 'C', 'D'],
        message: '{VALUE} is not a valid correct answer. Must be A, B, C, or D'
      }
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be negative']
    },
    negativeMarks: {
      type: Number,
      default: 0,
      min: [0, 'Negative marks cannot be negative']
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level'
      },
      default: 'Medium'
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    timeLimit: {
      type: Number,
      required: [true, 'Time limit is required'],
      min: [1, 'Time limit must be at least 1 second'],
      default: 30
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: '{VALUE} is not a valid status'
      },
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

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
