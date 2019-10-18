const fs = require("fs");
const xlsx = require("xlsx");
const skillModel = require("../models/skills.model");
const jobModel = require("../models/job.model");

/**
 * @swagger
 * definitions:
 *   Skill:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /skill/add:
 *   post:
 *     tags:
 *       - Skill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: skill
 *         description: Skill object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Skill'
 *     responses:
 *       200:
 *         description: New Skill
 *         schema:
 *           $ref: '#/definitions/Skill'
 */
module.exports.addSkill = (req, res) => {
  if (!req.body.name.trim()) {
    return res.status(400).send({
      error: true,
      message: "Skill name required"
    });
  }

  skillModel.findOne(
    {
      name: req.body.name.trim().toLowerCase()
    },
    (err, skillFound) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while finding skill",
          data: err
        });
      } else if (skillFound) {
        return res.status(400).send({
          error: true,
          message: "Skill already available with this name"
        });
      } else {
        const skill = new skillModel({
          _id: Math.floor(100000 + Math.random() * 900000),
          name: req.body.name.trim()
        });

        skill.save((err, skillSaved) => {
          if (err) {
            return res.status(500).send({
              error: true,
              message: "Error while saving skill",
              data: err
            });
          } else {
            return res.status(201).send({
              error: false,
              message: "Skill saved successfully"
            });
          }
        });
      }
    }
  );
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
 * /skill/bulk:
 *   post:
 *     tags:
 *       - Skill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: skill
 *         description: Skill object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Bulk'
 *     responses:
 *       200:
 *         description: New Skills bulk
 *         schema:
 *           $ref: '#/definitions/Bulk'
 */
module.exports.addBulkSkills = (req, res) => {
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
        const Skill = new skillModel({
          _id: Math.floor(100000 + Math.random() * 900000),
          name: sheet.name
        });

        Skill.save(err => {
          console.log("saved");
        });
      });

      res.send({
        error: false,
        message: "Skills saved successfully"
      });
    }
  });
};

/**
 * @swagger
 * /skill/all:
 *   get:
 *     tags:
 *       - Skill
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: New Skills bulk
 */
module.exports.getAllSkills = (req, res) => {
  skillModel.find({}, (err, skillsArr) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding skills",
        data: err
      });
    } else {
      return res.status(200).send({
        error: false,
        message: skillsArr.length ? "Skills found" : "No Skill found",
        data: skillsArr
      });
    }
  });
};

/**
 * @swagger
 * /skill/edit:
 *   post:
 *     tags:
 *       - Skill
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: skill
 *         description: Skill object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Skill'
 *       - name: id
 *         in: parameter
 *         required: true
 *     responses:
 *       200:
 *         description: New Skill
 *         schema:
 *           $ref: '#/definitions/Skill'
 */
module.exports.editSkill = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      error: true,
      message: "Skill name required"
    });
  }

  const skillId = req.params.skillId;
  skillModel.findOne({ name: req.body.name }, (err, skillFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding skill",
        data: err
      });
    } else if (skillFound && skillFound.name) {
      return res.status(400).send({
        error: true,
        message: "Skill name already exists"
      });
    } else {
      skillModel.findOneAndUpdate(
        { _id: skillId },
        { name: req.body.name },
        (err, skillUpdated) => {
          if (err) {
            return res.status(500).send({
              error: true,
              message: "Error while updating skill",
              data: err
            });
          } else {
            return res.status(200).send({
              error: false,
              message: "Skill updated successfully"
            });
          }
        }
      );
    }
  });
};

module.exports.deleteSkill = (req, res) => {
  skillModel.findOne({ _id: req.params.skillId }, (err, skill) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding skill",
        data: err
      });
    } else if (!skill) {
      return res.status(404).send({
        error: true,
        message: "No skill found with this ID"
      });
    } else {
      jobModel.find(
        {
          $or: [
            { mandatorySkills: skill.name },
            { goodToHaveSkills: skill.name }
          ]
        },
        (err, jobFound) => {
          if (err) {
            return res.status(500).send({
              error: true,
              message: "Error while finding Job with this skill",
              data: err
            });
          } else if (!jobFound.length) {
            skill.remove((err, skillDeleted) => {
              if (err) {
                return res.status(500).send({
                  error: true,
                  message: "Error while deleting skill",
                  data: err
                });
              } else if (!skillDeleted) {
                return res.status(404).send({
                  error: true,
                  message: "No skill found with this ID"
                });
              } else {
                return res.status(200).send({
                  error: false,
                  message: "Skill deleted successfully"
                });
              }
            });
          } else {
            return res.status(404).send({
              error: true,
              message: "This skill is already associated with some jobs"
            });
          }
        }
      );
    }
  });
};
