const axios = require('axios');

const setCoordinates = async (req, res, next) => {
  try {
    const address = req.body.address_warehouse;
    const response = await axios.get(`/api/opencage?q=${encodeURIComponent(address)}`);
    req.body.latitude = response.data.latitude;
    req.body.longitude = response.data.longitude;
    next();
  } catch (error) {
    res.status(500).send({
      message: "Error fetching coordinates",
      errors: error.message,
    });
  }
};

module.exports = setCoordinates;