const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const notificationController = require("../controllers/notification.controller");

router.use(authMiddleware);

router.get("/myNotifications", notificationController.getMyNotifications);

module.exports = router;
