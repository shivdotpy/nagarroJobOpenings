const referModel = require("../models/refer.model");

module.exports.addRefer = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      error: true,
      message: "Name required"
    });
  }

  if (!req.body.mobile) {
    return res.status(400).send({
      error: true,
      message: "Mobile required"
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      error: true,
      message: "Email required"
    });
  }

  if (!req.body.resume) {
    return res.status(400).send({
      error: true,
      message: "Resume required"
    });
  }

  if (!req.body.jobId) {
    return res.status(400).send({
      error: true,
      message: "Job Id required"
    });
  }

  const refer = new referModel({
    jobId: req.body.jobId,
    referBy: req.userId,
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

module.exports.updateReferalStatus = (req, res) => {
  const referId = req.params.referId;

  if (!req.body.status) {
    return res.status(400).send({
      error: true,
      message: "Status required"
    });
  }

  referModel.findById(referId, (err, referFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding the referal",
        data: err
      });
    } else if (!referFound) {
      return res.status(404).send({
        error: true,
        message: "No referal found with this ID"
      });
    } else {
      referFound.status = req.body.status;
      referFound.save((err, referalSaved) => {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while changing status",
            data: err
          });
        } else {
          return res.status(200).send({
            error: false,
            message: "Status changes successfully"
          });
        }
      });
    }
  });
};

module.exports.getReferalsByJobId = (req, res) => {
  referModel.find(
    { jobId: req.params.jobId },
    { resume: 0 },
    (err, referalsResult) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while finding referrals"
        });
      } else {
        return res.status(200).send({
          error: false,
          message: referalsResult.length
            ? "Referrals found"
            : "No referral exists",
          data: referalsResult
        });
      }
    }
  );
};

module.exports.getReferalsByUserId = (req, res) => {
  referModel.find({ referBy: req.userId }, (err, referalsFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding referals",
        data: err
      });
    } else {
      return res.status(200).send({
        error: false,
        message: referalsFound.length
          ? "Referals found"
          : "No referals available",
        data: referalsFound
      });
    }
  });
};
