const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const skillController = require("../controllers/skill.controller");

router.use(authMiddleware);

router.post("/add", skillController.addSkill);

router.post("/bulk", skillController.addBulkSkills);

router.get("/all", skillController.getAllSkills);

router.put("/edit/:skillId", skillController.editSkill);

router.delete("/delete/:skillId", skillController.deleteSkill);

module.exports = router;
