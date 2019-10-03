const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const locationController = require("../controllers/location.controller");

router.use(authMiddleware);

router.post("/add", locationController.addLocation);

router.post("/bulk", locationController.addBulkLocation);

router.get("/all", locationController.getAllLocations);

router.put("/edit/:locationId", locationController.editLocation);

router.delete("/delete/:locationId", locationController.deleteLocation);

module.exports = router;
