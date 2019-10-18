const mongoose = require("mongoose");

const referModel = mongoose.Schema({
  jobId: String,
  name: String,
  mobile: String,
  email: String,
  resume: String,
  status: { type: String, default: "Open" },
  referBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  priority: { type: String, default: "Medium" },
  isUpdated: { type: Boolean, default: false }
});

module.exports = mongoose.model("refer", referModel);
