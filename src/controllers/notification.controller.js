const notificationModel = require("../models/notification.model");

module.exports.getMyNotifications = (req, res) => {
  notificationModel.find({ userId: req.userId }, (err, notifications) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while getting notifications",
        data: err
      });
    } else {
      return res.status(200).send({
        error: false,
        message: notifications.length
          ? "Notifications found"
          : "No notification available",
        data: notifications
      });
    }
  });
};
