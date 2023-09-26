const axios = require("axios");

const addressUserCoordinate = async (req, res, next) => {
  try {
    const address = req.body.address_details;
    if (!address) {
      return next();
    }
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${process.env.KEY_OPENCAGE}`
    );

    const location = response.data?.results[0]?.geometry;

    req.body.latitude = location.lat;
    req.body.longitude = location.lng;

    next();
  } catch (error) {
    res.status(500).send({
      message: "Please input valid address",
      errors: error.message,
    });
  }
};

module.exports = addressUserCoordinate;
