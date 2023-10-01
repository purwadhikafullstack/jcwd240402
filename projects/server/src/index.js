const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const router = require("./routes");
const cookieParser = require("cookie-parser");
require("./schedule/cancelledOrder");
require("./schedule/clearVerifyToken");

const { createProxyMiddleware } = require("http-proxy-middleware");
const PORT = process.env.PORT || 8000;
const app = express();

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

/* MIDDLEWARE */

app.use(
  "/api/opencage",
  createProxyMiddleware({
    target: "https://api.opencagedata.com/geocode/v1/json",
    changeOrigin: true,
    pathRewrite: {
      "^/api/opencage": `${process.env.KEY_OPENCAGE}`,
    },
  })
);

app.use(
  "/api/rajaongkir/cost",
  createProxyMiddleware({
    target: "https://api.rajaongkir.com/starter/cost",
    changeOrigin: true,
  })
);

app.use(cors());
app.use(
  "/api/photo-profile",
  express.static(path.join(__dirname, "public", "imgProfile"))
);
app.use(
  "/api/payment-proof",
  express.static(path.join(__dirname, "public", "imgPayment"))
);

app.use(
  "/api/photo-warehouse",
  express.static(path.join(__dirname, "public", "imgWarehouse"))
);

app.use(
  "/api/src/public/imgCategory",
  express.static(path.join(__dirname, "public", "imgCategory"))
);

app.use(
  "/api/src/public/imgProduct",
  express.static(path.join(__dirname, "public", "imgProduct"))
);

app.use(cookieParser());
app.use(express.json());
// ==========================

/* USER ROUTES */
app.use("/api/user", router.user);
// ==========================

/* ADMIN ROUTES */
app.use("/api/admin", router.admin);
app.use("/api/warehouse", router.warehouse);
app.use("/api/warehouse-stock", router.warehouseStock);
// ==========================

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

module.exports = app;
