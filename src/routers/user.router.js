const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

router.use(authMiddleware);

router.post("/signup", userController.signup);

module.exports = router;
