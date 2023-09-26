const fs = require("fs").promises;
const path = require("path");
const db = require("../models");
const {
  createProductImageDBPath,
  extractFilenameFromDBPath,
  getAbsoluteProductImagePath,
} = require("../utils/helper/multer");
const { getAllProducts, getOneProduct } = require("../service/product");

//move to utils
async function moveUploadedFilesToDestination(images) {
  const filenames = await Promise.all(
    images.map(async (image) => {
      const sourcePath = image.path;
      const filename = `${new Date().getTime()}-${image.originalname}`;
      const destinationPath = getAbsoluteProductImagePath(filename);
      await fs.rename(sourcePath, destinationPath);
      return filename;
    })
  );
  return filenames;
}

module.exports = {
  async createProduct(req, res) {
    const { name, price, weight, category_id, description, is_active } =
      req.body;
    const images = req.files;

    const t = await db.sequelize.transaction();

    try {
      if (images && images.length > 5) {
        return res.status(400).json({
          message: "Maximum image count exceeded for the new product.",
        });
      }

      const newProduct = await db.Product.create(
        {
          name,
          price,
          weight,
          category_id,
          description,
          is_active,
        },
        { transaction: t }
      );

      let productWithImages = { ...newProduct.dataValues };

      if (images && images.length > 0) {
        const filenames = await moveUploadedFilesToDestination(images);

        const imageObjects = filenames.map((filename) => ({
          product_id: newProduct.id,
          img_product: createProductImageDBPath(filename),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await db.Image_product.bulkCreate(imageObjects, { transaction: t });

        productWithImages.images = imageObjects;
      }

      await t.commit();
      return res.status(201).send({
        message: "Product created successfully",
        data: productWithImages,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async updateProductDetails(req, res) {
    const { id } = req.params;
    const editableFields = [
      "name",
      "price",
      "weight",
      "category_id",
      "description",
    ];
    const t = await db.sequelize.transaction();

    try {
      const product = await db.Product.findByPk(id, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }

      editableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          product[field] = req.body[field];
        }
      });

      await product.save({ transaction: t });
      await t.commit();

      return res.status(200).send({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async addImageToProduct(req, res) {
    const product_id = req.params.id;
    const newImageFile = req.file;

    const t = await db.sequelize.transaction();

    try {
      const product = await db.Product.findByPk(product_id, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }

      const existingImageCount = await db.Image_product.count({
        where: { product_id: product_id },
      });

      if (existingImageCount >= 5) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "Maximum image count reached for the product." });
      }

      const newImage = await db.Image_product.create(
        {
          product_id: product_id,
          img_product: createProductImageDBPath(newImageFile.filename),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).send({
        message: "Image added to product successfully",
        data: newImage,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      return res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async updateProductImage(req, res) {
    const imgProductId = req.params.id;
    const newImageFile = req.file;

    const t = await db.sequelize.transaction();

    try {
      const updatedImage = await db.Image_product.findByPk(imgProductId, {
        transaction: t,
      });
      if (!updatedImage) {
        await t.rollback();
        return res.status(404).send({ message: "Image not found!" });
      }

      if (newImageFile) {
        if (updatedImage.img_product) {
          const oldImageFilename = extractFilenameFromDBPath(
            updatedImage.img_product
          );
          const oldImagePath = getAbsoluteProductImagePath(oldImageFilename);

          try {
            await fs.unlink(oldImagePath);
          } catch (err) {
            console.error("Error deleting old image file:", err);
          }
        }

        updatedImage.img_product = createProductImageDBPath(
          newImageFile.filename
        );
      }

      await updatedImage.save({ transaction: t });

      await t.commit();

      return res.status(200).send({
        message: "Product image updated successfully",
        data: updatedImage,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      return res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async deleteProductImage(req, res) {
    const imgProductId = req.params.id;

    const t = await db.sequelize.transaction();

    try {
      const deletedImage = await db.Image_product.findByPk(imgProductId, {
        transaction: t,
      });
      if (!deletedImage) {
        await t.rollback();
        return res.status(404).send({ message: "Image not found!" });
      }

      if (deletedImage.img_product) {
        const deletedImageFilename = extractFilenameFromDBPath(
          deletedImage.img_product
        );
        const deletedImagePath =
          getAbsoluteProductImagePath(deletedImageFilename);

        try {
          await fs.unlink(deletedImagePath);
        } catch (err) {
          console.error("Error deleting image file:", err);
        }
      }

      await deletedImage.destroy({ transaction: t });

      await t.commit();

      return res.status(200).send({
        message: "Product image deleted successfully",
      });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      return res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async toggleProductStatus(req, res) {
    const { name } = req.params;
    const t = await db.sequelize.transaction();

    try {
      const product = await db.Product.findOne(
        { where: { name } },
        { transaction: t }
      );

      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }

      product.is_active = !product.is_active;

      await product.save({ transaction: t });
      await t.commit();

      return res.status(200).send({
        message: "Product status updated successfully",
        data: product,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async deleteProduct(req, res) {
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    try {
      const product = await db.Product.findByPk(id, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }

      await db.Image_product.destroy({
        where: { product_id: id },
        transaction: t,
      });
      await product.destroy({ transaction: t });

      await t.commit();

      return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getProductsList(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const categoryId = req.query.category_id;
    const productName = req.query.product_name;

    const options = {
      where: {},
    };

    if (categoryId) {
      options.where.category_id = categoryId;
    }

    if (productName) {
      options.where.name = {
        [db.Sequelize.Op.like]: `%${productName}%`,
      };
    }
    try {
      const result = await getAllProducts(options, page, pageSize);
      if (result.success) {
        res.status(200).send(result);
      } else {
        res.status(500).send({
          success: false,
          message: "Error fetching products.",
          errors: result.error,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Fatal error on server.",
        errors: error.message,
      });
    }
  },

  getProductByProductName: async (req, res) => {
    const { name } = req.params;
    try {
      const productById = await db.Product.findOne({
        where: { name },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Image_product,
            as: "Image_products",
            attributes: ["img_product"],
          },
        ],
      });
      res.status(200).json({
        ok: true,
        result: productById,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Fatal error on server.",
        errors: error.message,
      });
    }
  },

  async getSingleProduct(req, res) {
    try {
      let filter = {};
      if (req.params.id) {
        filter.id = req.params.id;
      } else if (req.query.name) {
        filter.name = req.query.name;
      } else {
        return res.status(400).json({
          success: false,
          message: "Provide either product name or ID.",
        });
      }
      const result = await getOneProduct(filter);
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({ success: false, message: result.error });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  getProductPerCategory: async (req, res) => {
    try {
      const productsByCategory = await db.Category.findAll({
        include: [
          {
            model: db.Product,
            as: "products",
            include: [
              { model: db.Image_product, paranoid: false },
              { model: db.Category, as: "category" },
            ],
            where: { is_active: true },
          },
        ],
      });

      const formattedData = productsByCategory.map((category) => {
        return {
          id: category.id,
          category: category.name,
          category_img: category.category_img,
          products: category.products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category.name,
            price: product.price,
            product_img: product.Image_products.map((item) => ({
              img: item.img_product,
            }))[0],
          })),
        };
      });

      res.json({
        success: true,
        result: formattedData,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  getAllProductForSearchSuggestion: async (req, res) => {
    const { searchProduct } = req.query;
    try {
      const productsData = await db.Product.findAll({
        include: [
          { model: db.Image_product },
          { model: db.Category, as: "category" },
        ],
        where: {
          name: { [db.Sequelize.Op.like]: `${searchProduct}%` },
        },
      });

      const productName = productsData.map((item) => {
        return {
          name: item.name,
          img: item.Image_products[0]?.img_product,
          category: item.category?.name,
        };
      });

      res.json({
        ok: true,
        result: productName,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  getAllProductCategoryWithParanoid: async (req, res) => {
    const searchCategory = req.query.category || undefined;

    try {
      let whereCondition = {};

      if (searchCategory) {
        whereCondition = {
          name: {
            [db.Sequelize.Op.like]: `%${searchCategory}%`,
          },
        };
      }

      const result = await db.Product.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        paranoid: false,
        include: [
          {
            model: db.Category,
            as: "category",
            attributes: {
              exclude: ["updatedAt", "deletedAt", "createdAt"],
            },
            where: whereCondition,
          },
          {
            model: db.Image_product,
            attributes: { exclude: ["updatedAt", "createdAt"] },
          },
        ],
      });

      res.status(200).send({
        message: "success get products",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "An error occurred while fetching warehouse stocks",
        error: error.message,
      });
    }
  },
};
