const db = require("../models");

module.exports = {
  
  // Retrieve a single inventory transfer by filter
  getOneInventoryTransfer: async (filter) => {
    const options = {
      where: filter,
      include: [
        {
          model: db.Warehouse_stock,
          include: [
            { model: db.Product },
            { model: db.Warehouse }
          ]
        },
        { model: db.Warehouse, as: 'FromWarehouse' },
        { model: db.Warehouse, as: 'ToWarehouse' }
      ]
    };

    try {
      const result = await db.Inventory_transfer.findOne(options);
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
  
  // Retrieve all inventory transfers with pagination
  getAllInventoryTransfers: async (options = {}, page = 1, pageSize = 10) => {
    const filter = options.where || {};
    
    const queryOptions = {
      where: filter,
      include: [
        {
          model: db.Warehouse_stock,
          include: [
            { model: db.Product },
            { model: db.Warehouse }
          ]
        },
        { model: db.Warehouse, as: 'FromWarehouse' },
        { model: db.Warehouse, as: 'ToWarehouse' }
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.Inventory_transfer.findAll(queryOptions);
      const totalItems = await db.Inventory_transfer.count({ where: filter });

      return {
        success: true,
        data: results,
        pagination: {
          page: page,
          pageSize: pageSize,
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  

  approveInventoryTransfer: async (transferId) => {
    const transaction = await db.sequelize.transaction();
    
    try {
      const transfer = await db.Inventory_transfer.findByPk(transferId);

      if (!transfer || transfer.status !== 'Pending') {
        throw new Error('Invalid Transfer');
      }

      const warehouseStock = await db.Warehouse_stock.findByPk(transfer.warehouse_stock_id);

      if (warehouseStock.product_stock < transfer.quantity) {
        throw new Error('Insufficient stock');
      }

      warehouseStock.product_stock -= transfer.quantity;
      await warehouseStock.save({ transaction });


      const destWarehouseStock = await db.Warehouse_stock.findOne({
        where: {
          warehouse_id: transfer.to_warehouse_id,
          product_id: warehouseStock.product_id
        }
      });

      if (destWarehouseStock) {
        destWarehouseStock.product_stock += transfer.quantity;
        await destWarehouseStock.save({ transaction });
      } else {

        await db.Warehouse_stock.create({
          warehouse_id: transfer.to_warehouse_id,
          product_id: warehouseStock.product_id,
          product_stock: transfer.quantity
        }, { transaction });
      }

      transfer.status = 'Approve';
      await transfer.save({ transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Transfer approved successfully'
      };

    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return {
        success: false,
        error: error.message
      };
    }
  }

};
