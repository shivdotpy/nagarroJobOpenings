const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const referController = require("../controllers/refer.controller");

router.use(authMiddleware);

router.post("", referController.addRefer);

router.get("/:jobId", referController.getReferalsByJobId);

router.patch("/status/:referId", referController.updateReferalStatus);

module.exports = router;
