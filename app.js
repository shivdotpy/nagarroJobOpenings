const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Swagger
const swagger = require("./src/swagger/swagger");

// Routes
const userRoute = require("./src/routers/user.router");
const jobRoute = require("./src/routers/job.router");
const referRoute = require("./src/routers/refer.router");
const skillRoute = require("./src/routers/skill.router");
const locationRoute = require("./src/routers/location.router");
const dashboardRoute = require("./src/routers/dashboard.router");

const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());

// DB connection
// mongodb://shiv:shiv1234567890@ds163745.mlab.com:63745/nagarro
// mongodb://shiv:shiv123456789@ds235328.mlab.com:35328/nagarrotest
mongoose.connect(
  "mongodb://shiv:shiv1234567890@ds163745.mlab.com:63745/nagarro",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.get("/", (req, res) => {
  res.send("App is working");
});

app.use("/user", userRoute);
app.use("/job", jobRoute);
app.use("/refer", referRoute);
app.use("/skill", skillRoute);
app.use("/location", locationRoute);
app.use("/swagger", swagger.router);
app.use("/api", dashboardRoute);

app.listen(PORT);

module.exports = app;
