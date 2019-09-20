const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

module.exports.signup = (req, res) => {
  if (!req.body.email) {
    return res.status(403).send({
      error: true,
      message: "Email is required"
    });
  }
  if (!req.body.password) {
    return res.status(403).send({
      error: true,
      message: "Password is required"
    });
  }

  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while generating hash",
        data: err
      });
    } else {
      const user = new userModel({
        email: req.body.email,
        password: hash
      });
      user.save((err, saved) => {
        if (err) {
          return res.status(500).send({
            error: true,
            message: "Error while saving user",
            data: err
          });
        } else {
          return res.status(201).send({
            error: true,
            message: "User created successfully"
          });
        }
      });
    }
  });
};
