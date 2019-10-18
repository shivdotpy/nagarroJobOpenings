const mongoose = require("mongoose");

const locationModel = mongoose.Schema(
  {
    _id: Number,
    name: { type: String }
  },
  {
    timestamps: true,
    _id: false
  }
);

module.exports = mongoose.model("location", locationModel);
