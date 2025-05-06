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
    A10: {
      type: String,
      required: true,
      maxlength: 3
    },
    B11: {
      type: String,
      required: true,
      maxlength: 3
    },
    C12: {
      type: String,
      required: true,
      maxlength: 3
    },
    D13: {
      type: String,
      required: true,
      maxlength: 3
    },
    E14: {
      type: String,
      required: true,
      maxlength: 3
    },
    F15: {
      type: String,
      required: true,
      maxlength: 3
    },
   G16: {
      type: String,
      required: true,
      maxlength: 3
    },
    H17: {
      type: String,
      required: true,
      maxlength: 3
    },
    I18: {
      type: String,
      required: true,
      maxlength: 3
    },
    J19: {
      type: String,
      required: true,
      maxlength: 3
    },
  },
  { timestamps: true }
);


const gameResult = mongoose.model("gameResult", gameResultSchema);
module.exports = gameResult;