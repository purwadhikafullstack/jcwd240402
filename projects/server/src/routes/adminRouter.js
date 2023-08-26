const adminController = require("../controllers/adminController");
const validatorMiddlewareAdmin = require("../middleware/validator/admin");
const validatorMiddlewareCategory = require("../middleware/validator/category");
const validatorMiddlewareProduct = require("../middleware/validator/product");
const categoryController = require("../controllers/categoryController")
const productController = require("../controllers/productController")
const multerCategory = require("../middleware/multer/category/category")
const multerProduct = require("../middleware/multer/product/product")
const router = require("express").Router();

//admin
router.get("/profile", adminController.getAdminProfile);
router.post("/register",validatorMiddlewareAdmin.validateRegistration,adminController.registerAdmin); //check 
router.post("/login",validatorMiddlewareAdmin.validateLogin,adminController.loginAdmin);//check
router.post("/change-pass/:id",validatorMiddlewareAdmin.validatePassword,adminController.changeAdminPassword);//check
router.post("/assign-warehouse/:id", adminController.assignWarehouse);//check
router.get("/", adminController.getAdminList);


//category
router.post("/category",multerCategory.single("category_img"),validatorMiddlewareCategory.validateCategory,categoryController.createCategory);//check OK
router.patch("/category/img/:id", multerCategory.single("category_img"), categoryController.updateCategoryImage);// Check OK
router.patch("/category/name/:id", validatorMiddlewareCategory.validateCategory, categoryController.updateCategoryName);// CHeck OK
router.patch("/category/:id",categoryController.deleteCategory); //Check Ok
router.get("/categories",adminController.getCategories);//Check OK

//product
router.post("/product",multerProduct.array("images", 5),validatorMiddlewareProduct.validateProduct,productController.createProduct);//check ok
router.patch("/product/:id",validatorMiddlewareProduct.validateUpdateProduct,productController.updateProductDetails);

router.post("/product/:id/image",multerProduct.single("image"),productController.addImageToProduct);
router.patch("/product/image/:id",multerProduct.single("image"),productController.updateProductImage);
router.delete("/product/image/:id",productController.deleteProductImage);

router.get("/products",productController.getProductsList);
router.patch("/product/delete/:id",productController.deleteProduct);
router.get('/single-product/', productController.getSingleProduct);

//list
router.get("/city", adminController.getCitiesList);
router.get("/province", adminController.getProvincesList);

module.exports = router;