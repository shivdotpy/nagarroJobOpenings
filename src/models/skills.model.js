const mongoose = require("mongoose");

const skillModel = mongoose.Schema(
  {
    _id: Number,
    name: { type: String }
  },
  {
    timestamps: true,
    _id: false
  }
);

module.exports = mongoose.model("skill", skillModel);
