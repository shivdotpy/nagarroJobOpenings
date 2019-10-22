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
      // remove the docs
      //   notificationModel.deleteMany(
      //     { userId: req.userId },
      //     (err, notificationDeleted) => {
      //       if (err) {
      //         console.log("Error on deleting notifications", err);
      //       }
      //     }
      //   );

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

module.exports.readMyNotifications = (req, res) => {
  notificationModel.deleteMany(
    { userId: req.userId },
    (err, notificationDeleted) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while deleting the notifications",
          data: err
        });
      } else {
        return res.status(200).send({
          error: false,
          message: "Notification deleted successfully"
        });
      }
    }
  );
};
