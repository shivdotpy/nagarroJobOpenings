const referModel = require("../models/refer.model");
const mailer = require("../mailer/mailer");
const userModel = require("../models/user.model");
const jobModel = require("../models/job.model");
const fs = require("fs");
const path = require("path");

module.exports.addRefer = async (req, res) => {
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

  const jobAssociated = await jobModel.findById(req.body.jobId);

  if (jobAssociated) {
    referModel.findOne(
      {
        jobId: req.body.jobId,
        $or: [{ email: req.body.email }, { mobile: req.body.email }]
      },
      (err, referalFound) => {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while finding referal",
            data: err
          });
        } else if (referalFound) {
          return res.status(400).send({
            error: true,
            message: "Candidate already refered !"
          });
        } else {
          const refer = new referModel({
            jobId: req.body.jobId,
            referBy: req.userId,
            assignedTo: jobAssociated.postBy,
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
        }
      }
    );
  } else {
    const refer = new referModel({
      jobId: null,
      referBy: req.userId,
      assignedTo: null,
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
  }
};

module.exports.updateReferalStatus = (req, res) => {
  const referId = req.params.referId;

  // if (!req.body.status) {
  //   return res.status(400).send({
  //     error: true,
  //     message: "Status required"
  //   });
  // }

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
      if (req.body.status) {
        referFound.status = req.body.status;
        referFound.isUpdated = true;
      }

      if (req.body.priority) {
        referFound.priority = req.body.priority;
      }

      if (req.body.assignedTo) {
        referFound.assignedTo = req.body.assignedTo;
      }

      referFound.save((err, referalSaved) => {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while changing status",
            data: err
          });
        } else {
          // Mail to referal person

          userModel.findById(referFound.referBy, (err, user) => {
            fs.readFile(
              path.join(
                __dirname,
                "..",
                "mailer",
                "samples",
                "referalStatus.html"
              ),
              (err, referralHTML) => {
                mailer.mail(
                  user.email,
                  referralHTML
                    .toString()
                    .replace("#REFERBYNAME", user.email.split(".")[0])
                    .replace("#REFERRALNAME", referFound.name)
                    .replace("#REFERRALSTATUS", req.body.status)
                );
              }
            );
          });

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
  referModel
    .find({ jobId: req.params.jobId }, { resume: 0 }, (err, referalsResult) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while finding referrals",
          data: err
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
    })
    .populate("referBy", "email")
    .populate("assignedTo", "email");
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

module.exports.editReferalByUserId = async (req, res) => {
  const referId = req.params.referId;
  let referal;

  if (!req.body.resume) {
    referal = await referModel.findById(referId);
  }

  const requestBody = {
    resume: req.body.resume ? req.body.resume : referal.resume
  };

  Object.keys(req.body).map(key => {
    requestBody[key] = req.body[key];
  });

  referModel.findByIdAndUpdate(referId, requestBody, err => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while saving referal"
      });
    } else {
      return res.status(200).send({
        error: false,
        message: "Referal saved successfully"
      });
    }
  });
};

module.exports.getReferalResumeById = (req, res) => {
  referModel.findById(req.params.referId, (err, referalFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while getting referal",
        data: err
      });
    } else if (!referalFound) {
      return res.status(400).send({
        error: true,
        message: "No referal found with this id"
      });
    } else {
      return res.status(200).send({
        error: false,
        message: "Resume found",
        data: referalFound.resume
      });
    }
  });
};

module.exports.getAllReferal = (req, res) => {
  userModel.findById(req.userId, (err, userFound) => {
    if (err) {
      return res.status(500).send({
        error: false,
        message: "Error while finding user",
        data: err
      });
    } else {
      if (userFound.role === "admin") {
        referModel
          .find({ assignedTo: req.userId }, { resume: 0 }, (err, referals) => {
            if (err) {
              return res.status(500).send({
                error: true,
                message: "Error while finding referals"
              });
            } else {
              return res.status(200).send({
                error: false,
                message: referals.length
                  ? "Referals found"
                  : "No referals available",
                data: referals
              });
            }
          })
          .populate("referBy", "firstName");
      } else {
        referModel
          .find({}, { resume: 0 }, (err, referals) => {
            if (err) {
              return res.status(500).send({
                error: true,
                message: "Error while finding referals"
              });
            } else {
              return res.status(200).send({
                error: false,
                message: referals.length
                  ? "Referals found"
                  : "No referals available",
                data: referals
              });
            }
          })
          .populate("referBy", "firstName");
      }
    }
  });
};

module.exports.deleteReferal = (req, res) => {
  const referId = req.params.referId;

  userModel.findById(req.userId, (err, userFound) => {
    if (userFound.role !== "superadmin") {
      return res.status(403).send({
        error: true,
        message: "Permission denied"
      });
    } else {
      referModel.findByIdAndRemove(referId, (err, deleted) => {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while deleting the referal"
          });
        } else {
          return res.status(200).send({
            error: false,
            message: "Referal deleted successfully"
          });
        }
      });
    }
  });
};
