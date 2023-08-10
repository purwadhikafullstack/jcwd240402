const db = require("../models")
module.exports = {
    getOneAdmin: async (filter) => {
      const options = {
        where: filter
      };
  
      try {
        const result = await db.Province.findOne(options);
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
  
    getAllAdmins: async (filter = {}) => {
      const options = {
        where: filter
      };
  
      try {
        const results = await db.Province.findAll(options);
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
  