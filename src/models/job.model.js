const mongoose = require("mongoose");

const jobModel = mongoose.Schema(
  {
    _id: Number,
    title: String,
    mandatorySkills: Array,
    goodToHaveSkills: Array,
    location: Array,
    jobType: { type: String, lowercase: true },
    type: String,
    description: String,
    noOfPositions: Number,
    experienceRequired: String,
    postBy: String
  },
  {
    timestamps: true,
    _id: false
  }
);

module.exports = mongoose.model("job", jobModel);
