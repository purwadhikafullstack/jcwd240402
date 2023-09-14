const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const static = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "imgWarehouse"
    );

    cb(null, static);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const filename = file.originalname;
    cb(null, `${timestamp}-${filename}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = "File format is not matched";
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Invalid file format"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB (adjust the limit as needed)
  },
  fileFilter: imageFilter,
});

module.exports = handleImageProfileUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).send({ error: "File size exceeded the limit" });
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
          res.status(400).send({ error: "Invalid file format" });
        }
      } else {
        res.status(400).send({ error: err.message });
      }
    } else {
      next();
    }
  });
};
