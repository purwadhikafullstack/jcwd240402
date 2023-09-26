const adminController = require("../controllers/adminController");
const validatorMiddlewareAdmin = require("../middleware/validator/admin");
const validatorMiddlewareCategory = require("../middleware/validator/category");
const validatorMiddlewareProduct = require("../middleware/validator/product");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const inventoryController = require("../controllers/inventoryTransferController");
const handleImageCategoryUpload = require("../middleware/multer/category/category");
const handleImageProductUpload = require("../middleware/multer/product/product");
const statisticController = require("../controllers/statisticController");
const authMiddleware = require("../middleware/auth");
const router = require("express").Router();

// User Routes
router.get(
  "/user-list",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.getUsersList
);

// Admin Routes

router.post(
  "/register",
  authMiddleware.verifyAccessTokenSuperAdmin,
  validatorMiddlewareAdmin.validateRegistration,
  adminController.registerAdmin
);
router.post(
  "/login",
  validatorMiddlewareAdmin.validateLogin,
  adminController.loginAdmin
);
router.patch(
  "/change-pass/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  validatorMiddlewareAdmin.validatePassword,
  adminController.changeAdminPassword
);
router.patch(
  "/assign-warehouse/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  adminController.assignWarehouse
);

router.get("/checkrole", authMiddleware.verifyAccessTokenAdmin);
router.get("/", adminController.getAdminList);
router.get(
  "/profile",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.adminInformation
);
router.get(
  "/auth/keep-login",
  authMiddleware.verifyRefreshToken,
  adminController.keepLogin
);
router.get(
  "/order-list",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.getUserOrder
);
router.get(
  "/order-detail-list",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.getUserOrderDetails
);
router.patch(
  "/accept-user-payment/:id",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.acceptPayment
);
router.patch(
  "/reject-user-payment/:id",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.rejectPayment
);
router.patch(
  "/send-order/:id",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.sendUserOrder
);
router.patch(
  "/cancel-order/:id",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.CancelUserOrder
);

router.get(
  "/sales-report",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.salesReport
);

router.get(
  "/year",
  authMiddleware.verifyAccessTokenAdmin,
  adminController.getAvailableYear
);

router.delete(
  "/:adminId",
  authMiddleware.verifyAccessTokenSuperAdmin,
  adminController.deleteAdmin
);

// Category Routes

router.get("/categories", adminController.getCategories);

router.post(
  "/category",
  authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageCategoryUpload,
  validatorMiddlewareCategory.validateCategory,
  categoryController.createCategory
);

router.patch(
  "/category/img/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageCategoryUpload,
  categoryController.updateCategoryImage
);
router.patch(
  "/category/name/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  validatorMiddlewareCategory.validateCategory,
  categoryController.updateCategoryName
);
router.patch(
  "/category/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  categoryController.deleteCategory
);

// Product Routes

router.get("/products", productController.getProductsList);
router.get("/single-product/", productController.getSingleProduct);

router.post(
  "/product",
  authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageProductUpload,
  validatorMiddlewareProduct.validateProduct,
  productController.createProduct
);

router.post(
  "/product/:id/image",
  authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageProductUpload,
  productController.addImageToProduct
);

router.patch(
  "/product/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  validatorMiddlewareProduct.removeEmptyFields,
  validatorMiddlewareProduct.validateUpdateProduct,
  productController.updateProductDetails
);

router.patch(
  "/product/image/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  handleImageProductUpload,
  productController.updateProductImage
);

router.patch(
  "/product/status/:name",
  authMiddleware.verifyAccessTokenSuperAdmin,
  productController.toggleProductStatus
);

router.delete(
  "/product/image/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  productController.deleteProductImage
);

router.delete(
  "/products/:id",
  authMiddleware.verifyAccessTokenSuperAdmin,
  productController.deleteProduct
);

// Inventory Transfer Routes

router.get(
  "/transfers",
  authMiddleware.verifyAccessTokenAdmin,
  inventoryController.getInventoryTransferList
);

router.post(
  "/stock-transfer",
  authMiddleware.verifyAccessTokenAdmin,
  inventoryController.stockTransfer
);

router.patch(
  "/stock-transfers/:transferid/approve",
  authMiddleware.verifyAccessTokenAdmin,
  inventoryController.approveStockTransfer
);
router.patch(
  "/stock-transfers/:transferid/reject",
  authMiddleware.verifyAccessTokenAdmin,
  inventoryController.rejectStockTransfer
);


// List Routes

router.get("/city", adminController.getCitiesList);
router.get("/province", adminController.getProvincesList);

// Statistic
router.get("/statistic", statisticController.userStatistic);
router.get("/statistic/pie-chart", statisticController.pieChart);
router.get("/statistic/top-ten-product", statisticController.topTenProduct);
router.get("/statistic/income-graph", authMiddleware.verifyAccessTokenAdmin, statisticController.incomeGraph);

module.exports = router;
