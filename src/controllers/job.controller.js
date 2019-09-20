const jobModel = require("../models/job.model");

module.exports.add = (req, res) => {
  const Job = new jobModel({
    title: req.body.title,
    description: req.body.description,
    jobType: req.body.jobType,
    location: req.body.location,
    skills: req.body.skills,
    noOfPositions: req.body.noOfPositions
  });

  Job.save((err, savedJob) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while saving job",
        data: err
      });
    } else {
      return res.status(201).send({
        error: false,
        message: "Job saved successfully"
      });
    }
  });
};
