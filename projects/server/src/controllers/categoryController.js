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
      let category_img = "";

      if (req.file) {
        category_img = createCategoryImageDBPath(req.file.filename);
      }

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

  async updateCategory(req, res) {
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

      if (name) {
        category.name = name;
      }

      if (req.file) {
        if (category.category_img) {
          const oldImagePath = getAbsoluteCategoryImagePath(
            extractFilenameFromDBPath(category.category_img)
          );
          await fs.unlink(oldImagePath);
        }

        category.category_img = createCategoryImageDBPath(req.file.filename);
      }

      if (name || req.file) {
        await category.save({ transaction: t });
        await t.commit();

        return res.status(200).send({
          message: "Category updated successfully",
          data: category,
        });
      } else {
        return res.status(400).send({
          message: "No updates provided",
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

  
};
