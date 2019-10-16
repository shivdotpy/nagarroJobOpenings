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
    postBy: String
  },
  {
    timestamps: true,
    _id: false
  }
);

module.exports = mongoose.model("job", jobModel);
