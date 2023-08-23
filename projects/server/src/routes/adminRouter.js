const adminController = require("../controllers/adminController");
const validatorMiddleware = require("../middleware/validator/admin");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const multerMiddleware = require("../middleware/multer/category/category");
const router = require("express").Router();

//admin
router.get("/profile", adminController.getAdminProfile);
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
router.get("/", adminController.getAdminList);

router.post(
  "/category",
  multerMiddleware.single("category_img"),
  categoryController.createCategory
);
router.patch(
  "/category/:id",
  multerMiddleware.single("category_img"),
  categoryController.updateCategory
);
router.patch("/category/delete/:id", categoryController.deleteCategory);
router.get("/categories", adminController.getCategories);

router.post(
  "/product",
  multerMiddleware.array("images", 5),
  productController.createProduct
);
router.patch("/product/:id", productController.updateProductDetails);
router.patch(
  "/product/image/:id",
  multerMiddleware.single("image"),
  productController.updateProductImage
);
router.get("/products", productController.getProductsList);
router.patch("/product/delete/:id", productController.deleteProduct);
router.get("/single-product/", productController.getSingleProduct);

//list
router.get("/city", adminController.getCitiesList);
router.get("/province", adminController.getProvincesList);

module.exports = router;
