const referModel = require("../models/refer.model");

module.exports.addRefer = (req, res) => {
  if (!req.body.name) {
    return res.status(403).send({
      error: true,
      message: "Name required"
    });
  }

  if (!req.body.mobile) {
    return res.status(403).send({
      error: true,
      message: "Mobile required"
    });
  }

  if (!req.body.email) {
    return res.status(403).send({
      error: true,
      message: "Email required"
    });
  }

  if (!req.body.resume) {
    return res.status(403).send({
      error: true,
      message: "Resume required"
    });
  }

  const refer = new referModel({
    jobId: req.body.jobId,
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    resume: req.body.resume
  });

  refer.save((err, referSaved) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while saving referal",
        data: err
      });
    } else {
      return res.status(200).send({
        error: false,
        message: "Referal saved successfully"
      });
    }
  });
};
