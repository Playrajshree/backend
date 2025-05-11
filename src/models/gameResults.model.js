const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    creatorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    A10: {
      type: Number,
      required: true,
    },
    B11: {
      type: Number,
      required: true,
    },
    C12: {
      type: Number,
      required: true,
    },
    D13: {
      type: Number,
      required: true,
    },
    E14: {
      type: Number,
      required: true,
    },
    F15: {
      type: Number,
      required: true,
    },
   G16: {
      type: Number,
      required: true,
    },
    H17: {
      type: Number,
      required: true,
    },
    I18: {
      type: Number,
      required: true,
    },
    J19: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);


const gameResult = mongoose.model("gameResult", gameResultSchema);
module.exports = gameResult;