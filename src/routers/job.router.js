const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const jobController = require("../controllers/job.controller");

router.use(authMiddleware);

router.post("/add", jobController.add);

router.get("/latest", jobController.getLatestJobs);

router.delete("/delete/:id", jobController.deleteJob);

module.exports = router;
