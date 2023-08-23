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

async function moveUploadedFileToDestination(image) {
  const sourcePath = image.path;
  const filename = `${new Date().getTime()}-${image.originalname}`;
  const destinationPath = getAbsoluteProductImagePath(filename);

  await fs.rename(sourcePath, destinationPath);

  return filename;
}

module.exports = {
  async createProduct(req, res) {
    const { name, price, weight, category_id, description, is_active } =
      req.body;
    const images = req.files;
    console.log(req.files);

    const t = await db.sequelize.transaction();

    try {
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
    const { name, price, weight, category_id, description } = req.body;
    const t = await db.sequelize.transaction();

    try {
      const product = await db.Product.findByPk(id, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }

      product.name = name;
      product.price = price;
      product.weight = weight;
      product.category_id = category_id;
      product.description = description;

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

  async updateProductImage(req, res) {
    const product_id = req.params.id;
    const imgProductId = req.body.img_product_id;

    if (!req.file) {
      return res.status(400).send({ message: "No image uploaded" });
    }

    const t = await db.sequelize.transaction();

    try {
      const product = await db.Product.findByPk(product_id, { transaction: t });

      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }

      let image;

      if (imgProductId) {
        image = await db.Image_product.findByPk(imgProductId, {
          where: { product_id: product_id },
          transaction: t,
        });

        if (!image) {
          await t.rollback();
          return res.status(404).send({ message: "Image not found!" });
        }

        if (image.img_product) {
          const oldImageFilename = extractFilenameFromDBPath(image.img_product);
          const oldImagePath = getAbsoluteProductImagePath(oldImageFilename);

          try {
            await fs.unlink(oldImagePath);
          } catch (err) {
            console.error("Error deleting old image file:", err);
          }
        }
      } else {
        image = await db.Image_product.create(
          {
            product_id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction: t }
        );
      }

      const newFilename = await moveUploadedFileToDestination(req.file);
      image.img_product = createProductImageDBPath(newFilename);
      await image.save({ transaction: t });

      await t.commit();

      return res.status(200).send({
        message: imgProductId
          ? "Product image updated successfully"
          : "Product image added successfully",
        data: product,
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
    const priceRange = parseInt(req.query.priceRange, 10);

    const options = {
      where: {},
    };

    if (categoryId) {
      options.where.category_id = categoryId;
    }

    switch (priceRange) {
      case 1:
        options.where.price = {
          [db.Sequelize.Op.between]: [1, 100000],
        };
        break;
      case 2:
        options.where.price = {
          [db.Sequelize.Op.between]: [100000, 500000],
        };
        break;
      case 3:
        options.where.price = {
          [db.Sequelize.Op.gt]: 500000,
        };
        break;
      default:
        break;
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

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const productById = await db.Product.findByPk(id, {
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
};
