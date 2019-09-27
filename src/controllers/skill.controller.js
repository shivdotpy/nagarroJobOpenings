const skillModel = require("../models/skills.model");
const jobModel = require("../models/job.model");

module.exports.addSkill = (req, res) => {
  if (!req.body.name) {
    return res.status(403).send({
      error: true,
      message: "Skill name required"
    });
  }

  skillModel.findOne(
    { name: req.body.name.toLowerCase() },
    (err, skillFound) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while finding skill",
          data: err
        });
      } else if (skillFound) {
        console.log(skillFound);
        return res.status(403).send({
          error: true,
          message: "Skill already available with this name"
        });
      } else {
        const skill = new skillModel({
          name: req.body.name
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

module.exports.editSkill = (req, res) => {
  if (!req.body.name) {
    return res.status(403).send({
      error: true,
      message: "Skill name required"
    });
  }

  const skillId = req.params.skillId;
  skillModel.findOne({ _id: skillId }, (err, skillFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding skill",
        data: err
      });
    } else if (skillFound) {
      return res.status(403).send({
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
      return res.status(403).send({
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
              message: "Error while finding Job with the skill",
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
                return res.status(403).send({
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
            return res.status(403).send({
              error: true,
              message: "This skill is already associated with some jobs"
            });
          }
        }
      );
    }
  });
};
