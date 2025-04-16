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
    xa: {
      type: String,
      required: true,
    },
    xb: {
      type: String,
      required: true,
    },
    xc: {
      type: String,
      required: true,
    },
    xd: {
      type: String,
      required: true,
    },
    xe: {
      type: String,
      required: true,
    },
    xf: {
      type: String,
      required: true,
    },
   xg: {
      type: String,
      required: true,
    },
    xh: {
      type: String,
      required: true,
    },
    xi: {
      type: String,
      required: true,
    },
    xj: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


const gameResult = mongoose.model("gameResult", gameResultSchema);
module.exports = gameResult;