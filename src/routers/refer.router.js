const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const referController = require("../controllers/refer.controller");

router.use(authMiddleware);

router.post("", referController.addRefer);

router.get("/all", referController.getAllReferal);

router.get("/userReferals", referController.getReferalsByUserId);

router.get("/:jobId", referController.getReferalsByJobId);

router.put("/edit/:referId", referController.editReferalByUserId);

router.patch("/status/:referId", referController.updateReferalStatus);

router.get("/resume/:referId", referController.getReferalResumeById);

module.exports = router;
