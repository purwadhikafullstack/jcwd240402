const axios = require("axios");

const addressUserCoordinateUpdate = async (req, res, next) => {
  try {
    const address = JSON.parse(req.body.data);
    console.log(address);
    if (!address.address_details) {
      return next();
    }
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address.address_details
      )}&key=${process.env.KEY_OPENCAGE}`
    );

    const location = response.data?.results[0]?.geometry;
    address.latitude = location?.lat;
    address.longitude = location?.lng;
    console.log(address.latitude);
    console.log(address.longitude);
    req.body.data = JSON.stringify(address);
    next();
  } catch (error) {
    res.status(500).send({
      message: "Error fetching coordinates",
      errors: error.message,
    });
  }
};

module.exports = addressUserCoordinateUpdate;
