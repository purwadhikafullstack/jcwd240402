const jwt = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (dataAccessToken) => {
    const token = jwt.sign(dataAccessToken, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    return token;
  },

  generateRefreshToken: (dataRefreshToken) => {
    const token = jwt.sign(dataRefreshToken, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    return token;
  },

  token: (dataToken, secretToken, exp) => {
    const token = jwt.sign(dataToken, secretToken, {
      expiresIn: `${exp}`,
    });
    return token;
  },
};
