const { required } = require('joi');
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
    A11: {
      type: String,
      required: true,
    },
    B12: {
      type: String,
      required: true,
    },
    C13: {
      type: String,
      required: true,
    },
    D14: {
      type: String,
      required: true,
    },
    E15: {
      type: String,
      required: true,
    },
    F16: {
      type: String,
      required: true,
    },
   G17: {
      type: String,
      required: true,
    },
    H18: {
      type: String,
      required: true,
    },
    I19: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


const gameResult = mongoose.model("gameResult", gameResultSchema);
module.exports = gameResult;