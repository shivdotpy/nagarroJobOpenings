const mongoose = require("mongoose");

const skillModel = mongoose.Schema({
  name: { type: String, lowercase: true }
});

module.exports = mongoose.model("skill", skillModel);
