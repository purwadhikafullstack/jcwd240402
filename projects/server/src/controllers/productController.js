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
    const editableFields = ['name', 'price', 'weight', 'category_id', 'description'];
    const t = await db.sequelize.transaction();
  
    try {
      const product = await db.Product.findByPk(id, { transaction: t });
  
      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }
  
      editableFields.forEach(field => {
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
    const imgProductId = req.body.img_product_id;
<<<<<<<<< Temporary merge branch 1

    if (!imgProductId || !req.file) {
      return res.status(400).send({ message: "Missing required data" });
    }

=========
    const newImageFile = req.file;

  
>>>>>>>>> Temporary merge branch 2
    const t = await db.sequelize.transaction();
  
    try {
      const product = await db.Product.findByPk(product_id, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).send({ message: "Product not found!" });
      }
  
      const updatedImage = await db.Image_product.findByPk(imgProductId, { transaction: t });
      if (!updatedImage) {
        await t.rollback();
        return res.status(404).send({ message: "Image not found!" });
      }
  
      if (updatedImage.img_product) {
        const oldImageFilename = extractFilenameFromDBPath(updatedImage.img_product);
        const oldImagePath = getAbsoluteProductImagePath(oldImageFilename);
  
>>>>>>>>> Temporary merge branch 2
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image file:", err);
        }
      }
<<<<<<<<< Temporary merge branch 1

      const newFilename = await moveUploadedFileToDestination(req.file);
      image.img_product = createProductImageDBPath(newFilename);
      await image.save({ transaction: t });

=========
      await updatedImage.save({ transaction: t });
  
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

<<<<<<<<< Temporary merge branch 1
=========
  async addImagesToProduct(req, res) {
    const product_id = req.params.id;
    const newImageFiles = req.files;
  
    const t = await db.sequelize.transaction();
  
    try {
      const updatedImage = await db.Image_product.findByPk(imgProductId, { transaction: t });
      if (!updatedImage) {
        await t.rollback();
        return res.status(404).send({ message: "Image not found!" });
      }
  
      if (newImageFile) {
        if (updatedImage.img_product) {
          const oldImageFilename = extractFilenameFromDBPath(updatedImage.img_product);
          const oldImagePath = getAbsoluteProductImagePath(oldImageFilename);
  
          try {
            await fs.unlink(oldImagePath);
          } catch (err) {
            console.error("Error deleting old image file:", err);
          }
        }
  
        updatedImage.img_product = createProductImageDBPath(newImageFile.filename);
      }
  
      await updatedImage.save({ transaction: t });
  
      await t.commit();
  
      return res.status(200).send({
        message: "Product image updated successfully",
        data: updatedImage, // Use the updatedImage variable instead of 'product'
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
      const deletedImage = await db.Image_product.findByPk(imgProductId, { transaction: t });
      if (!deletedImage) {
        await t.rollback();
        return res.status(404).send({ message: "Image not found!" });
      }
  
      if (deletedImage.img_product) {
        const deletedImageFilename = extractFilenameFromDBPath(deletedImage.img_product);
        const deletedImagePath = getAbsoluteProductImagePath(deletedImageFilename);
  
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
  
  
  

>>>>>>>>> Temporary merge branch 2
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
    const pageSize = parseInt(req.query.pageSize, 9) || 9;
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
        [db.Sequelize.Op.like]: `%${productName}%`
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
  
};
