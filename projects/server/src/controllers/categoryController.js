const db = require("../models");
const {
  createCategoryImageDBPath,
  extractFilenameFromDBPath,
  getAbsoluteCategoryImagePath,
} = require("../utils/helper/multer");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  async createCategory(req, res) {
    const { name } = req.body;

    const t = await db.sequelize.transaction();

    try {
      if (!req.file?.filename) {
        return res.status(400).send({
          message: "Image is required",
        });
      }

      const category_img = createCategoryImageDBPath(req.file?.filename);

      const newCategory = await db.Category.create(
        {
          name,
          category_img,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).send({
        message: "Category created successfully",
        data: newCategory,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async updateCategoryImage(req, res) {
    const categoryId = req.params.id;

    const t = await db.sequelize.transaction();

    try {
      const category = await db.Category.findByPk(categoryId);

      if (!category) {
        await t.rollback();
        return res.status(404).send({
          message: "Category not found",
        });
      }

      if (req.file) {
        if (category.category_img) {
          const oldImagePath = getAbsoluteCategoryImagePath(
            extractFilenameFromDBPath(category.category_img)
          );
          await fs.unlink(oldImagePath);
        }

        category.category_img = createCategoryImageDBPath(req.file.filename);
        await category.save({ transaction: t });
        await t.commit();

        return res.status(200).send({
          message: "Category image updated successfully",
          data: category,
        });
      } else {
        return res.status(400).send({
          message: "No image provided for update",
        });
      }
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async updateCategoryName(req, res) {
    const categoryId = req.params.id;
    const { name } = req.body;

    const t = await db.sequelize.transaction();

    try {
      const category = await db.Category.findByPk(categoryId);

      if (!category) {
        await t.rollback();
        return res.status(404).send({
          message: "Category not found",
        });
      }

      if (name !== undefined) {
        category.name = name;
        await category.save({ transaction: t });
        await t.commit();

        return res.status(200).send({
          message: "Category name updated successfully",
          data: category,
        });
      } else {
        return res.status(400).send({
          message: "No name provided for update",
        });
      }
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async deleteCategory(req, res) {
    const categoryId = req.params.id;
    const t = await db.sequelize.transaction();
    
    try {
      const category = await db.Category.findByPk(categoryId);
      if (!category) {
        await t.rollback();
        return res.status(404).send({
          message: "Category not found",
        });
      }

      if (parseInt(categoryId) === 9) {
        await t.rollback();
        return res.status(400).send({
          message: "Uncategorized cannot be deleted.",
        });
      }
      
      const productsToUpdate = await db.Product.findAll({
        where: {
          category_id: categoryId,
        },
        transaction: t,
      });

      for (const product of productsToUpdate) {
        product.category_id = 9;
        await product.save({ transaction: t });
      }

      await category.destroy({ transaction: t });
      
      await t.commit();
      
      return res.status(200).send({
        message: "Category deleted successfully",
        data: category,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
  

  getAllCategory: async (req, res) => {
    try {
      const allCategory = await db.Category.findAll({
        attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
      });
      res.json({
        ok: true,
        result: allCategory,
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
  getAllCategoryWithParanoid: async (req, res) => {
    try {
      const allCategory = await db.Category.findAll({
        attributes: { exclude: ["deletedAt", "updatedAt", "createdAt"] },
        paranoid: false,
      });
      res.json({
        ok: true,
        result: allCategory,
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
};
