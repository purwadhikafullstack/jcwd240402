const db = require("../models");

module.exports = {
  getTopProducts: async (req, res) => {
    try {
      const topProducts = await db.Order_detail.findAll({
        attributes: [
          [db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'total_quantity']
        ],
        include: [{
          model: db.Warehouse_stock,
          attributes: [],
          include: [{
            model: db.Product,
            attributes: ['name'],
          }]
        }],
        group: ['Warehouse_stock.Product.id', 'Warehouse_stock.product_id'], 
        order: [[db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'DESC']], 
        limit: 10 
      });
  

      const formattedData = topProducts.map(product => ({
        name: product.Warehouse_stock.Product.name,
        total_quantity: product.dataValues.total_quantity
      }));
  
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

};
