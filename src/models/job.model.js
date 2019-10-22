const mongoose = require("mongoose");

const jobModel = mongoose.Schema(
  {
    _id: Number,
    title: String,
    mandatorySkills: Array,
    goodToHaveSkills: Array,
    location: Array,
    jobType: String,
    type: String,
    description: String,
    noOfPositions: Number,
    experience: String,
    postBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    priority: { type: String, default: "medium" },
    status: { type: String, default: "Open" }
  },
  {
    timestamps: true,
    _id: false
  }
);

module.exports = mongoose.model("job", jobModel);
