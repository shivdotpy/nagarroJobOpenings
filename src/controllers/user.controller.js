const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

/**
 * @swagger
 * definitions:
 *   Signup:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: skill
 *         description: Signup object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Signup'
 *     responses:
 *       200:
 *         description: New User
 *         schema:
 *           $ref: '#/definitions/Signup'
 */
module.exports.signup = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      error: true,
      message: "Email is required"
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
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
      return res.status(400).send({
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

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: skill
 *         description: Signup object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Signup'
 *     responses:
 *       200:
 *         description: New User
 *         schema:
 *           $ref: '#/definitions/Signup'
 */
module.exports.login = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      error: true,
      message: "Email is required"
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
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
              firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
              lastName: lastName
                ? lastName.charAt(0).toUpperCase() + lastName.slice(1)
                : null,
              role: userResult.role
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

/**
 * @swagger
 * /user/info:
 *   get:
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User Info
 */
module.exports.getUserInfoByToken = (req, res) => {
  userModel.findById(req.userId, { role: 1, email: 1 }, (err, userFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while getting user by Token"
      });
    } else if (!userFound) {
      return res.status(400).send({
        error: true,
        message: "No User found"
      });
    } else {
      let firstName = userFound.email.split("@")[0].split(".")[0];
      let lastName = userFound.email.split("@")[0].split(".")[1];
      let data = {};
      data.firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      data.lastName = lastName
        ? lastName.charAt(0).toUpperCase() + lastName.slice(1)
        : null;
      data.role = userFound.role;
      data.email = userFound.email;
      return res.status(200).send({
        error: false,
        message: "User found",
        data: data
      });
    }
  });
};

/**
 * @swagger
 * /user/allHr:
 *   get:
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User Info
 */
module.exports.getHrNames = (req, res) => {
  userModel.find({ role: "admin" }, (err, allHr) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding all hr",
        data: err
      });
    } else {
      return res.status(200).send({
        error: false,
        message: allHr.length ? "Hr found" : "No Hr found",
        data: allHr
      });
    }
  });
};
