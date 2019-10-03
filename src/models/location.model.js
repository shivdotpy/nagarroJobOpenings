const mongoose = require("mongoose");

const locationModel = mongoose.Schema(
  {
    _id: Number,
    name: { type: String, lowercase: true }
  },
  {
    timestamps: true,
    _id: false
  }
);

module.exports = mongoose.model("location", locationModel);
