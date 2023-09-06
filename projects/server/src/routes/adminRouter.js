const adminController = require("../controllers/adminController");
const Verify = require("../middleware/auth");
const validatorMiddlewareAdmin = require("../middleware/validator/admin");
const validatorMiddlewareCategory = require("../middleware/validator/category");
const validatorMiddlewareProduct = require("../middleware/validator/product");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const inventoryController = require("../controllers/inventoryTransferController")
const multerCategory = require("../middleware/multer/category/category");
const multerProduct = require("../middleware/multer/product/product");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

// Admin Routes

router.post("/register",authMiddleware.verifyAccessTokenSuperAdmin,validatorMiddlewareAdmin.validateRegistration,adminController.registerAdmin); 
router.post("/login",validatorMiddlewareAdmin.validateLogin,adminController.loginAdmin); 
router.patch("/change-pass/:id",authMiddleware.verifyAccessTokenSuperAdmin,validatorMiddlewareAdmin.validatePassword,adminController.changeAdminPassword);
router.patch("/assign-warehouse/:id",authMiddleware.verifyAccessTokenSuperAdmin, adminController.assignWarehouse);

router.get("/checkrole",authMiddleware.verifyAccessTokenAdmin,adminController.getRole);
router.get("/", adminController.getAdminList);
router.get("/profile",Verify.verifyAccessTokenAdmin,adminController.adminInformation);
router.get("/auth/keep-login",Verify.verifyRefreshToken,adminController.keepLogin);

// Category Routes

router.get("/categories", adminController.getCategories);

router.post("/category",authMiddleware.verifyAccessTokenSuperAdmin,multerCategory.single("category_img"),validatorMiddlewareCategory.validateCategory,categoryController.createCategory);

router.patch("/category/img/:id",authMiddleware.verifyAccessTokenSuperAdmin,multerCategory.single("category_img"),categoryController.updateCategoryImage);
router.patch("/category/name/:id",authMiddleware.verifyAccessTokenSuperAdmin,validatorMiddlewareCategory.validateCategory,categoryController.updateCategoryName);
router.patch("/category/:id",authMiddleware.verifyAccessTokenSuperAdmin,categoryController.deleteCategory);

// Product Routes

router.get("/products", productController.getProductsList);
router.get("/single-product/", productController.getSingleProduct);

router.post("/product",authMiddleware.verifyAccessTokenSuperAdmin,multerProduct.array("images", 5),validatorMiddlewareProduct.validateProduct,productController.createProduct);
router.post("/product/:id/image",authMiddleware.verifyAccessTokenSuperAdmin,multerProduct.single("image"),productController.addImageToProduct);

router.patch("/product/:id",authMiddleware.verifyAccessTokenSuperAdmin,validatorMiddlewareProduct.removeEmptyFields,validatorMiddlewareProduct.validateUpdateProduct,productController.updateProductDetails);
router.patch("/product/image/:id",authMiddleware.verifyAccessTokenSuperAdmin,multerProduct.single("image"),productController.updateProductImage);
router.patch("/product/delete/:id",authMiddleware.verifyAccessTokenSuperAdmin, productController.deleteProduct);
router.patch("/product/status/:name",authMiddleware.verifyAccessTokenSuperAdmin, productController.toggleProductStatus);

router.delete("/product/image/:id",authMiddleware.verifyAccessTokenSuperAdmin, productController.deleteProductImage);

// Inventory Transfer Routes

router.get('/transfers', inventoryController.getInventoryTransferList);

router.post("/stock-transfer", inventoryController.stockTransfer);

router.patch("/stock-transfers/:transferid/approve", inventoryController.approveStockTransfer);
router.patch("/stock-transfers/:transferid/reject", inventoryController.rejectStockTransfer);

// List Routes

router.get("/city", adminController.getCitiesList);
router.get("/province", adminController.getProvincesList);

module.exports = router;
