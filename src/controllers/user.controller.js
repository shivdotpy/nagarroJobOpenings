const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

  // check if user already exists or not
  userModel.findOne({ email: req.body.email }, (err, userFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding user",
        data: err
      });
    } else if (userFound) {
      return res.status(403).send({
        error: true,
        message: "User already exists"
      });
    } else {
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
                error: false,
                message: "User created successfully"
              });
            }
          });
        }
      });
    }
  });
};

module.exports.login = (req, res) => {
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

  userModel.findOne({ email: req.body.email }, (err, userResult) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding user",
        data: err
      });
    } else if (!userResult) {
      return res.status(401).send({
        error: true,
        message: "Unauthorised Access"
      });
    } else {
      bcrypt.compare(req.body.password, userResult.password, function(
        err,
        result
      ) {
        if (result) {
          var token = jwt.sign({ userId: userResult._id }, "nagarroSecret");

          // User Name
          const user = req.body.email.split("@")[0];
          let firstName = "";
          let lastName = "";
          if (user.includes(".")) {
            firstName = user.split(".")[0];
            lastName = user.split(".")[1];
          } else {
            firstName = user;
          }

          return res.status(200).send({
            error: false,
            message: "Logged in successfully",
            data: {
              token: token,
              firstName: firstName,
              lastName: lastName ? lastName : null
            }
          });
        } else {
          return res.status(401).send({
            error: true,
            message: "Unauthorised Access"
          });
        }
      });
    }
  });
};
