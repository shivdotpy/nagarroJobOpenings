const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    message: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("notification", notificationSchema);
