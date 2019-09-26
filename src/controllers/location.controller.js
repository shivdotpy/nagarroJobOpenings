const locationModel = require("../models/location.model");

module.exports.addLocation = (req, res) => {
  if (!req.body.name) {
    return res.status(403).send({
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
        return res.status(403).send({
          error: true,
          message: "Location already available with this name"
        });
      } else {
        const location = new locationModel({
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
    return res.status(403).send({
      error: true,
      message: "Location name required"
    });
  }

  const locationId = req.params.locationId;
  locationModel.findOne({ _id: locationId }, (err, locationFound) => {
    if (err) {
      return res.status(500).send({
        error: true,
        message: "Error while finding location",
        data: err
      });
    } else if (locationFound) {
      return res.status(403).send({
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
  locationModel.findOneAndRemove(
    { _id: req.params.locationId },
    (err, locationDeleted) => {
      if (err) {
        return res.status(500).send({
          error: true,
          message: "Error while deleting location",
          data: err
        });
      } else if (!skillDeleted) {
        return res.status(403).send({
          error: true,
          message: "No location found with this ID"
        });
      } else {
        return res.status(200).send({
          error: false,
          message: "Location deleted successfully"
        });
      }
    }
  );
};
