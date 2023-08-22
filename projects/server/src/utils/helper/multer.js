const path = require("path");

module.exports = {
  convertDBPathToRealPath(dbPath) {
    return `${process.env.BASE_PATH}${dbPath}`;
  },

  createCategoryImageDBPath(filename) {
    return `/src/public/imgCategory/${filename}`;
  },

  createProductImageDBPath(filename) {
    return `/src/public/imgProduct/${filename}`;
  },

  extractFilenameFromDBPath(dbPath) {
    if (!dbPath || dbPath === "") {
      return "";
    }
    const pathSegments = dbPath.split("/");
    if (pathSegments.length < 5) {
      return "";
    }
    return pathSegments[4];
  },

  getAbsoluteCategoryImagePath(filename) {
    return path.join(__dirname, "..", "..", "public", "imgCategory", filename);
  },

  getAbsoluteProductImagePath(filename) {
    return path.join(__dirname, "..", "..", "public", "imgProduct", filename);
  },
};
