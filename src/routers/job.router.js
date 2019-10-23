const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const jobController = require("../controllers/job.controller");

router.use(authMiddleware);

router.post("/add", jobController.add);

router.post("/bulk", jobController.bulkUpload);

router.get("/latest", jobController.getLatestJobs);

router.delete("/delete/:id", jobController.deleteJob);

router.put("/edit/:id", jobController.editJobs);

router.patch("/updateStatus/:id", jobController.updateJobStatus);

module.exports = router;
