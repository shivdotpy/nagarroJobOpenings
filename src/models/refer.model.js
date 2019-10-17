const mongoose = require("mongoose");

const referModel = mongoose.Schema({
  jobId: String,
  name: String,
  mobile: String,
  email: String,
  resume: String,
  status: { type: String, default: "Open" },
  referBy: String,
  priority: { type: String, default: "medium" }
});

module.exports = mongoose.model("refer", referModel);
