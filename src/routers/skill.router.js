const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const skillController = require("../controllers/skill.controller");

router.use(authMiddleware);

router.post("/add", skillController.addSkill);

router.get("/all", skillController.getAllSkills);

router.put("/edit/:skillId", skillController.editSkill);

module.exports = router;
