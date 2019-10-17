const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.use(authMiddleware);

router.get("/info", userController.getUserInfoByToken);

router.get("/allhr", userController.getHrNames);

module.exports = router;
