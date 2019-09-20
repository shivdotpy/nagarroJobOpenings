const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    email: String,
    password: String,
    role: { type: String, default: "user" }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", userModel);
