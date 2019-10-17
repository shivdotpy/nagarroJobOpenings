const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, lowercase: true },
    password: String,
    role: { type: String, default: "user" }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", userModel);
