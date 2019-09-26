const mongoose = require("mongoose");

const locationModel = mongoose.Schema({
  name: { type: String, lowercase: true }
});

module.exports = mongoose.model("location", locationModel);
