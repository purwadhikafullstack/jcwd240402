const axios = require("axios");

const setCoordinates = async (req, res, next) => {
  try {
    const address = req.body.address_warehouse;
    if (!address) {
      return next();
    }
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=f2f57cc907854a3cb36d25b445d148e6`
    );
    // req.body.latitude = response.data.latitude;
    // req.body.longitude = response.data.longitude;

    const location = response.data.results[0].geometry;
    req.body.latitude = location.lat;
    req.body.longitude = location.lng;
    next();
  } catch (error) {
    res.status(500).send({
      message: "Error fetching coordinates",
      errors: error.message,
    });
  }
};

module.exports = setCoordinates;
