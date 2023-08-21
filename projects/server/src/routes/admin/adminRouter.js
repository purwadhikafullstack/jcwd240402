const adminController = require("../../controllers/admin/adminController");
const validatorMiddleware = require("../../middleware/validator/admin");
const service = require("../../service/index")
const categoryController = require("../../controllers/category/categoryController")
const productController = require("../../controllers/product/productController")
const multerMiddleware = require("../../middleware/multer/category/category")
const router = require("express").Router();

router.get("/profile", adminController.getAdminProfile);
router.post("/register",validatorMiddleware.validateRegistration,adminController.registerAdmin);
router.post("/login",validatorMiddleware.validateLogin,adminController.loginAdmin);
router.post("/change-pass/:id",validatorMiddleware.validatePassword,adminController.changeAdminPassword);
router.post("/assign-warehouse/:id", adminController.assignWarehouse);
router.get("/", adminController.getAdminList);

router.post("/category", multerMiddleware.single("category_img"), categoryController.createCategory);
router.patch("/category/:id", multerMiddleware.single("category_img"), categoryController.updateCategory);
router.patch("/category/delete/:id",categoryController.deleteCategory);

router.post("/product",multerMiddleware.array("images", 5),productController.createProduct);
router.patch("/product/:id",productController.updateProductDetails);
router.patch("/product/image/:id",multerMiddleware.single("image"),productController.updateProductImage);
router.get("/products",productController.getProductsList);
router.patch("/product/delete/:id",productController.deleteProduct);

router.get("/city", adminController.getCitiesList);
router.get("/province", adminController.getProvincesList);

module.exports = router;
