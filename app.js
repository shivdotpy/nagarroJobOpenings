const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Routes
const userRoute = require("./src/routers/user.router");
const jobRoute = require("./src/routers/job.router");

const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());

// DB connection
// mongodb://shiv:shiv1234567890@ds163745.mlab.com:63745/nagarro
mongoose.connect(
  "mongodb://shiv:shiv1234567890@ds163745.mlab.com:63745/nagarro",
  { useNewUrlParser: true },
  () => {
    console.log("DB connected");
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("App is working");
});

app.use("/user", userRoute);
app.use("/job", jobRoute);

app.listen(PORT, () => {
  console.log(`Listning on port ${PORT}`);
});