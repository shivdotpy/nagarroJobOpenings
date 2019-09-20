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

module.exports.getLatestJobs = (req, res) => {
  // Pagination
  let limit = parseInt(req.query.count);
  let skip = (parseInt(req.query.page) - 1) * parseInt(req.query.count);

  jobModel.find(
    {},
    { title: 1, createdAt: 1 },
    { sort: { createdAt: -1 }, limit, skip: skip ? skip : 0 },
    (err, results) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while getting job",
          data: err
        });
      } else {
        res.status(200).send({
          error: false,
          data: results
        });
      }
    }
  );
};
