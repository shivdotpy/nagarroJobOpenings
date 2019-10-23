const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const http = require("http").createServer(app);
var io = require("socket.io")(http);

// Swagger
const swagger = require("./src/swagger/swagger");

// Routes
const userRoute = require("./src/routers/user.router");
const jobRoute = require("./src/routers/job.router");
const referRoute = require("./src/routers/refer.router");
const skillRoute = require("./src/routers/skill.router");
const locationRoute = require("./src/routers/location.router");
const dashboardRoute = require("./src/routers/dashboard.router");
const notificationRoute = require("./src/routers/notification.router");

const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());
app.use(morgan("dev"));

// DB connection
// mongodb://shiv:shiv1234567890@ds163745.mlab.com:63745/nagarro
// mongodb://shiv:shiv1234567890@ds117070.mlab.com:17070/nagarrotest
// mongodb+srv://shivdotpy:shiv1234567890@cluster0-6zuqf.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect(
  "mongodb+srv://shivdotpy:shiv1234567890@cluster0-6zuqf.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
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
app.use("/notification", notificationRoute);
app.use("/swagger", swagger.router);
app.use("/api", dashboardRoute);

http.listen(PORT);

io.on("connection", client => {
  client.on("why", () => {
    console.log("why");
    client.emit("timer", new Date());
  });
});

// app.listen(PORT);

module.exports = app;
