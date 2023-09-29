const jwt = require("jsonwebtoken");

module.exports = {
  verifyAccessTokenUser: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }

        const { role_id } = payload;
        if (role_id !== 3) {
          return res.status(403).send({
            ok: false,
            message: "Unauthorized role",
          });
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          error,
        });
      }
    }
  },

  verifyAccessTokenAdmin: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }

        const { role_id } = payload;
        if (role_id !== 2 && role_id !== 1) {
          return res.status(403).send({
            ok: false,
            message: "Unauthorized role",
            role: payload,
          });
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          payload: authorization,
          error,
        });
      }
    }
  },

  verifyAccessTokenSuperAdmin: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }

        const { role_id } = payload;
        if (role_id !== 1) {
          return res.status(403).send({
            ok: false,
            message: "Unauthorized role",
          });
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          error,
        });
      }
    }
  },

  verifyRefreshToken: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          error,
        });
      }
    }
  },
};
