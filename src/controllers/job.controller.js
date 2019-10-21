const jobModel = require("../models/job.model");
const fs = require("fs");
const xlsx = require("xlsx");

/**
 * @swagger
 * definitions:
 *   Job:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       jobType:
 *         type: string
 *       type:
 *         type: string
 *       location:
 *         type: string
 *       mandatorySkills:
 *         type: string
 *       goodToHaveSkills:
 *         type: string
 *       noOfPositions:
 *         type: number
 *       experience:
 *         type: string
 */

/**
 * @swagger
 * /job/add:
 *   post:
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: job
 *         description: Job object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Job'
 *     responses:
 *       200:
 *         description: New Job
 *         schema:
 *           $ref: '#/definitions/Job'
 */
module.exports.add = (req, res) => {
  const Job = new jobModel({
    _id: Math.floor(100000 + Math.random() * 900000),
    title: req.body.title,
    description: req.body.description,
    jobType: req.body.jobType,
    type: req.body.type,
    location: req.body.location,
    mandatorySkills: req.body.mandatorySkills,
    goodToHaveSkills: req.body.goodToHaveSkills,
    noOfPositions: req.body.noOfPositions,
    experience: req.body.experience,
    postBy: req.userId,
    assignedTo: req.userId
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

/**
 * @swagger
 * definitions:
 *   Bulk:
 *     type: object
 *     properties:
 *       file:
 *         type: string
 */

/**
 * @swagger
 * /job/bulk:
 *   post:
 *     tags:
 *       - Job
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: job
 *         description: Job object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Bulk'
 *     responses:
 *       200:
 *         description: New Job
 *         schema:
 *           $ref: '#/definitions/Bulk'
 */
module.exports.bulkUpload = (req, res) => {
  if (!req.body.file) {
    return res.status(400).send({
      error: true,
      message: "file required"
    });
  }

  if (!req.body.file.includes("spreadsheet")) {
    return res.status(400).send({
      error: true,
      message: "Only excel file can be used for bulk upload"
    });
  }

  let file = req.body.file.split(";base64,")[1];
  fs.writeFile("src/temp/temp.xlsx", file, { encoding: "base64" }, function(
    err
  ) {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while creating xlsx file",
        data: err
      });
    } else {
      const workbook = xlsx.readFile("src/temp/temp.xlsx");
      const sheetData = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );

      sheetData.forEach(sheet => {
        const Job = new jobModel({
          _id: Math.floor(100000 + Math.random() * 900000),
          title: sheet.title,
          description: sheet.description,
          jobType: sheet.jobType,
          type: sheet.type,
          location: sheet.location.split(","),
          mandatorySkills: sheet.mandatorySkills.split(","),
          goodToHaveSkills: sheet.goodToHaveSkills.split(","),
          noOfPositions: sheet.noOfPositions,
          experience: sheet.experience,
          postBy: req.userId,
          assignedTo: req.userId
        });

        Job.save(err => {
          console.log("job saved");
        });
      });

      res.send({
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
    { type: { $regex: new RegExp(req.query.type, "i") } },
    {},
    { sort: { createdAt: -1 }, limit, skip: skip ? skip : 0 },
    (err, results) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while getting job",
          data: err
        });
      } else {
        if (results.length) {
          res.status(200).send({
            error: false,
            data: results,
            message: results.length ? "Jobs found" : "No jobs available"
          });
        } else {
          jobModel.find(
            {},
            {},
            { sort: { createdAt: -1 }, limit, skip: skip ? skip : 0 },
            (err, finalResult) => {
              if (err) {
                return res.status(500).send({
                  error: true,
                  message: "Error while getting job",
                  data: err
                });
              } else {
                res.status(200).send({
                  error: false,
                  data: finalResult,
                  message: finalResult.length
                    ? "Jobs found"
                    : "No jobs available"
                });
              }
            }
          );
        }
      }
    }
  );
};

module.exports.deleteJob = (req, res) => {
  const jobId = req.params.id;

  jobModel.findOne({ _id: jobId }, (err, jobFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding Job",
        data: err
      });
    } else if (!jobFound) {
      return res.status(404).send({
        error: true,
        message: "No job available with this ID"
      });
    } else {
      jobModel.findOneAndDelete({ _id: jobId }, (err, jobDeleted) => {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while deleting Job",
            data: err
          });
        } else {
          return res.status(200).send({
            error: false,
            message: "Job opening deleted successfully"
          });
        }
      });
    }
  });
};

module.exports.editJobs = (req, res) => {
  const jobId = req.params.id;

  jobModel.findOneAndUpdate(
    { _id: jobId },
    {
      title: req.body.title,
      description: req.body.description,
      jobType: req.body.jobType,
      location: req.body.location,
      mandatorySkills: req.body.mandatorySkills,
      goodToHaveSkills: req.body.goodToHaveSkills,
      noOfPositions: req.body.noOfPositions,
      experience: req.body.experience
    },
    (err, jobUpdated) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while updating Job",
          data: err
        });
      } else {
        return res.status(200).send({
          error: false,
          message: "Job updated successfully"
        });
      }
    }
  );
};
