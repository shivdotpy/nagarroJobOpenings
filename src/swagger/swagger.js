const express = require("express");
const router = express.Router();

const options = {
  swaggerDefinition: {
    info: {
      title: "Nagarro",
      version: "1.0.1"
    },
    tags: [
      {
        name: "User"
      },
      {
        name: "Job"
      }
    ],
    schemes: ["https"],
    host: "nagarro-openings.herokuapp.com",
    basePath: ""
  },
  apis: [
    "./src/controllers/user.controller.js",
    "./src/controllers/skill.controller.js",
    "./src/controllers/job.controller.js",
    "./src/controllers/dashboard.controller.js"
  ]
};

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = swaggerJSDoc(options);

router.get("/json", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = {
  router
};
