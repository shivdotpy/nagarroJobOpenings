const fs = require("fs");
const xlsx = require("xlsx");
const locationModel = require("../models/location.model");
const jobModel = require("../models/job.model");

module.exports.addLocation = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      error: true,
      message: "Location name required"
    });
  }

  locationModel.findOne(
    { name: req.body.name.toLowerCase() },
    (err, locationFound) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while finding location",
          data: err
        });
      } else if (locationFound) {
        return res.status(400).send({
          error: true,
          message: "Location already available with this name"
        });
      } else {
        const location = new locationModel({
          _id: Math.floor(100000 + Math.random() * 900000),
          name: req.body.name
        });

        location.save((err, locationSaved) => {
          if (err) {
            return res.status(500).send({
              error: true,
              message: "Error while saving location",
              data: err
            });
          } else {
            return res.status(201).send({
              error: false,
              message: "Location saved successfully"
            });
          }
        });
      }
    }
  );
};

module.exports.addBulkLocation = (req, res) => {
  if (!req.body.file) {
    return res.status(400).send({
      error: true,
      message: "file required"
    });
  }

  let file = req.body.file.split(";base64,")[1];

  fs.writeFile("src/temp/temp.xlsx", file, { encoding: "base64" }, function(
    err
  ) {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while creating xlsx file",
        data: err
      });
    } else {
      const workbook = xlsx.readFile("src/temp/temp.xlsx");
      const sheetData = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );

      sheetData.forEach(sheet => {
        const Location = new locationModel({
          _id: Math.floor(100000 + Math.random() * 900000),
          name: sheet.name
        });

        Location.save(err => {
          console.log("saved");
        });
      });

      res.send({
        error: false,
        message: "Locations saved successfully"
      });
    }
  });
};

module.exports.getAllLocations = (req, res) => {
  locationModel.find({}, (err, locationsArr) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding locations",
        data: err
      });
    } else {
      return res.status(200).send({
        error: false,
        message: locationsArr.length ? "Locations found" : "No Location found",
        data: locationsArr
      });
    }
  });
};

module.exports.editLocation = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      error: true,
      message: "Location name required"
    });
  }

  const locationId = req.params.locationId;
  locationModel.findOne({ name: req.body.name }, (err, locationFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding location",
        data: err
      });
    } else if (locationFound && locationFound.name) {
      return res.status(400).send({
        error: true,
        message: "Location name already exists"
      });
    } else {
      locationModel.findOneAndUpdate(
        { _id: locationId },
        { name: req.body.name },
        (err, locationUpdated) => {
          if (err) {
            return res.status(500).send({
              error: true,
              message: "Error while updating location",
              data: err
            });
          } else {
            return res.status(200).send({
              error: false,
              message: "Location updated successfully"
            });
          }
        }
      );
    }
  });
};

module.exports.deleteLocation = (req, res) => {
  locationModel.findOne({ _id: req.params.locationId }, (err, location) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding location",
        data: err
      });
    } else if (!location) {
      return res.status(404).send({
        error: true,
        message: "No location found with this ID"
      });
    } else {
      jobModel.find(
        {
          location: location.name
        },
        (err, jobFound) => {
          if (err) {
            return res.status(500).send({
              error: true,
              message: "Error while finding Job with this location",
              data: err
            });
          } else if (!jobFound.length) {
            location.remove((err, locationDeleted) => {
              if (err) {
                return res.status(500).send({
                  error: true,
                  message: "Error while deleting location",
                  data: err
                });
              } else if (!locationDeleted) {
                return res.status(404).send({
                  error: true,
                  message: "No location found with this ID"
                });
              } else {
                return res.status(200).send({
                  error: false,
                  message: "Location deleted successfully"
                });
              }
            });
          } else {
            return res.status(400).send({
              error: true,
              message: "This location is already associated with some jobs"
            });
          }
        }
      );
    }
  });
};
