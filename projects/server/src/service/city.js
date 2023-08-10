const db = require("../models")
module.exports = {
    getOneCity: async (filter) => {
      const options = {
        where: filter
      };
  
      try {
        const result = await db.City.findOne(options);
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
  
    getAllCities: async (filter = {}) => {
      const options = {
        where: filter
      };
  
      try {
        const results = await db.City.findAll(options);
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