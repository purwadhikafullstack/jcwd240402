import React, { useState, useEffect } from "react";
import TableComponent from "../../Table";
import DefaultPagination from "../../Pagination";
import AsyncSelect from "react-select/async";
import UpdateStock from "../../modal/stock/ModalUpdateStock";
import ConfirmDeleteStock from "../../modal/stock/ModalDeleteStock";
import TransferStockModal from "../../modal/inventoryTransfer/TransferStockModal";
import axios from "../../../api/axios";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [productToTransfer, setProductToTransfer] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, [selectedWarehouse, currentPage]);

  const fetchStocks = async () => {
    try {
      const warehouseName = selectedWarehouse ? selectedWarehouse.label : null;
      const response = await axios.get(`/warehouse-stock`, {
        params: {
          warehouseName: warehouseName,
          page: currentPage,
        },
      });
      console.log(response);

      if (response.data && response.data.stocks) {
        const flattenedStocks = [];
        Object.keys(response.data.stocks).forEach((warehouse) => {
          response.data.stocks[warehouse].forEach((stock) => {
            flattenedStocks.push({
              "Warehouse Name": warehouse,
              "Warehouse ID": stock.warehouse_id,
              Image: stock.Product.Image_products[0]?.img_product || "",
              "Product Name": stock.Product.name,
              "Product ID": stock.Product.id,
              Stock: stock.product_stock,
            });
          });
        });
        setStocks(flattenedStocks);
      }

      if (response.data && response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const loadWarehouses = async (inputValue) => {
    try {
      const response = await axios.get(`/warehouse/warehouse-list`, {
        params: {
          searchName: inputValue,
        },
      });
      if (response.data && response.data.warehouses) {
        const formattedWarehouses = response.data.warehouses.map(
          (warehouse) => ({
            value: warehouse.id,
            label: warehouse.warehouse_name,
          })
        );
        return formattedWarehouses;
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      return [];
    }
  };

  const handleEdit = (row) => {
    setSelectedProduct({
      warehouseId: row["Warehouse ID"],
      productId: row["Product ID"],
    });
    setShowUpdateModal(true);
  };

  const handleSuccessfulEdit = () => {
    fetchStocks();
    setShowUpdateModal(false);
  };

  const handleDelete = (row) => {
    setProductToDelete({
      warehouseId: row["Warehouse ID"],
      productId: row["Product ID"],
    });
    setShowDeleteModal(true);
  };

  const handleSuccessfulDelete = () => {
    fetchStocks();
    setShowDeleteModal(false);
  };

  const handleTransfer = (row) => {
    setProductToTransfer({
      fromWarehouseId: row["Warehouse ID"],
      productId: row["Product ID"],
    });
    setShowTransferModal(true);
  };

  return (
    <div className="container mx-auto pt-1">
      <div className="flex items-center">
      <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadWarehouses}
          onChange={setSelectedWarehouse}
          placeholder="Select a warehouse"
          className="flex-1"
        />
        <input
          type="text"
          placeholder="Search Product "
          // value={}
          // onChange={(e) => setSearchName(e.target.value)}
          className="flex-1 border rounded text-base bg-white border-gray-300 shadow-sm ml-4"
        />
      </div>
      <div className="py-4">
        <TableComponent
          headers={["Warehouse Name", "Image", "Product Name", "Stock"]}
          data={stocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTransfer={handleTransfer}
          showTransfer={true}
        />
      </div>
      <div className="flex justify-center items-center mt-4">
        <DefaultPagination
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <UpdateStock
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        warehouseId={selectedProduct?.warehouseId}
        productId={selectedProduct?.productId}
        handleSuccessfulEdit={handleSuccessfulEdit}
      />
      <ConfirmDeleteStock
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        warehouseId={productToDelete?.warehouseId}
        productId={productToDelete?.productId}
        onSuccessfulDelete={handleSuccessfulDelete}
      />
      <TransferStockModal
        show={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        productId={productToTransfer?.productId}
        fromWarehouseId={productToTransfer?.fromWarehouseId}
        fetchStocks={fetchStocks}
      />
    </div>
  );
};

export default StockList;
