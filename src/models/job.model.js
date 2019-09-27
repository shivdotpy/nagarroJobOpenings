const mongoose = require("mongoose");

const jobModel = mongoose.Schema(
  {
    title: String,
    mandatorySkills: Array,
    goodToHaveSkills: Array,
    location: String,
    jobType: String,
    description: String,
    noOfPositions: Number,
    experienceRequired: String,
    postBy: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("job", jobModel);
