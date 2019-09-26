const mongoose = require("mongoose");

const jobModel = mongoose.Schema(
  {
    title: String,
    skills: Array,
    location: String,
    jobType: String,
    description: String,
    noOfPositions: Number,
    experienceRequired: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("job", jobModel);
