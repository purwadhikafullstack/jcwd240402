import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../Table";
import DefaultPagination from "../../Pagination";
import AsyncSelect from "react-select/async";
import UpdateStock from "../../Modals/stock/ModalUpdateStock";
import ConfirmDeleteStock from "../../Modals/stock/ModalDeleteStock";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, [selectedWarehouse, currentPage]);

  const fetchStocks = async () => {
    try {
      const warehouseName = selectedWarehouse ? selectedWarehouse.label : null;
      const response = await axios.get(
        `http://localhost:8000/api/warehouse-stock`,
        {
          params: {
            warehouseName: warehouseName,
            page: currentPage,
          },
        }
      );
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

  const loadWarehouses = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/warehouse/warehouse-list`,
        {
          params: {
            searchName: inputValue,
            cityId: "",
          },
        }
      );

      if (response.data && response.data.warehouses) {
        const formattedWarehouses = response.data.warehouses.map(
          (warehouse) => ({
            value: warehouse.id,
            label: warehouse.warehouse_name,
            warehouse_name: warehouse.warehouse_name,
          })
        );
        callback(formattedWarehouses);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
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
  console.log(selectedProduct);

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

  return (
    <div className="container mx-auto p-4">
      <div className="pb-4">
        <AsyncSelect
          cacheOptions
          loadOptions={loadWarehouses}
          onChange={setSelectedWarehouse}
          placeholder="Select a warehouse"
        />
      </div>
      <div className="py-4">
        <TableComponent
          headers={["Warehouse Name", "Image", "Product Name", "Stock"]}
          data={stocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
    </div>
  );
};

export default StockList;
