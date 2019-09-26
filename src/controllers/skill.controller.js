const skillModel = require("../models/skills.model");

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
  res.send("Edit skill by id");
};
