const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

router.post("/signup", userController.signup);
router.use(authMiddleware);
router.post("/login", userController.login);

module.exports = router;
