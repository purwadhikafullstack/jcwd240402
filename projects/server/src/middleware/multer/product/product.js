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
      "imgProduct"
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
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { files: 5, fileSize: 10 * 1000 * 1000 },
  fileFilter: imageFilter,
});

module.exports = upload;
