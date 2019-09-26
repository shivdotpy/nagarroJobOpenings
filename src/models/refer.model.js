const mongoose = require("mongoose");

const referModel = mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  resume: String
});

module.exports = mongoose.model("refer", referModel);
