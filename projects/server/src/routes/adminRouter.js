const adminController = require("../controllers/adminController");
const Verify = require("../middleware/auth");
const validatorMiddlewareAdmin = require("../middleware/validator/admin");
const validatorMiddlewareCategory = require("../middleware/validator/category");
const validatorMiddlewareProduct = require("../middleware/validator/product");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const multerCategory = require("../middleware/multer/category/category");
const multerProduct = require("../middleware/multer/product/product");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

// Admin Routes

//admin

router.post(
  "/register",
  validatorMiddlewareAdmin.validateRegistration,
  adminController.registerAdmin
); //check
router.post(
  "/login",
  validatorMiddlewareAdmin.validateLogin,
  adminController.loginAdmin
); //check
router.post(
  "/change-pass/:id",
  validatorMiddlewareAdmin.validatePassword,
  adminController.changeAdminPassword
); //check
router.post("/assign-warehouse/:id", adminController.assignWarehouse); //check
router.get(
  "/checkrole",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.getRole
);
router.get("/", adminController.getAdminList);
router.get(
  "/profile",
  Verify.verifyAccessTokenAdmin,
  adminController.adminInformation
);
router.get(
  "/auth/keep-login",
  Verify.verifyRefreshToken,
  adminController.keepLogin
);

router.post(
  "/register",
  validatorMiddlewareAdmin.validateRegistration,
  adminController.registerAdmin
);
router.post(
  "/login",
  validatorMiddlewareAdmin.validateLogin,
  adminController.loginAdmin
);
router.post("/assign-warehouse/:id", adminController.assignWarehouse);
router.post(
  "/change-pass/:id",
  validatorMiddlewareAdmin.validatePassword,
  adminController.changeAdminPassword
);

// Category Routes

router.get("/categories", adminController.getCategories);

router.post(
  "/category",
  multerCategory.single("category_img"),
  validatorMiddlewareCategory.validateCategory,
  categoryController.createCategory
);
router.patch(
  "/category/img/:id",
  multerCategory.single("category_img"),
  categoryController.updateCategoryImage
);
router.patch(
  "/category/name/:id",
  validatorMiddlewareCategory.validateCategory,
  categoryController.updateCategoryName
);
router.patch("/category/:id", categoryController.deleteCategory);

// Product Routes

router.get("/products", productController.getProductsList);
router.get("/single-product/", productController.getSingleProduct);

router.post(
  "/product",
  multerProduct.array("images", 5),
  validatorMiddlewareProduct.validateProduct,
  productController.createProduct
);
router.post(
  "/product/:id/image",
  multerProduct.single("image"),
  productController.addImageToProduct
);

router.patch(
  "/product/:id",
  validatorMiddlewareProduct.validateUpdateProduct,
  productController.updateProductDetails
);
router.patch(
  "/product/image/:id",
  multerProduct.single("image"),
  productController.updateProductImage
);
router.patch("/product/delete/:id", productController.deleteProduct);
router.patch("/product/status/:name", productController.toggleProductStatus);

router.delete("/product/image/:id", productController.deleteProductImage);

// List Routes

router.get("/city", adminController.getCitiesList);
router.get("/province", adminController.getProvincesList);

module.exports = router;
