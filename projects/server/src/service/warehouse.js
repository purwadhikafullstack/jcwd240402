const db = require("../models")
module.exports = {
    getOneWarehouse: async (filter) => {
      const options = {
        where: filter
      };
  
      try {
        const result = await db.Warehouse.findOne(options);
        return {
          success: true,
          data: result
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: error.message
        };
      }
    },
  
    getAllWarehouses: async (filter = {}) => {
      const options = {
        where: filter
      };
  
      try {
        const results = await db.Warehouse.findAll(options);
        return {
          success: true,
          data: results
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  };