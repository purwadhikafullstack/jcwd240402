import React, { useState, useEffect } from "react";
import TableComponent from "../../Table";
import DefaultPagination from "../../Pagination";
import AsyncSelect from "react-select/async";
import UpdateStock from "../../modal/stock/ModalUpdateStock";
import ConfirmDeleteStock from "../../modal/stock/ModalDeleteStock";
import TransferStockModal from "../../modal/inventoryTransfer/TransferStockModal";
import { getCookie } from "../../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import ProductDetailsModal from "../../modal/stock/ModalProductDetails";
import axios from "../../../api/axios";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchProductName, setSearchProductName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [productToTransfer, setProductToTransfer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const access_token = getCookie("access_token");

  useEffect(() => {
    fetchStocks();
  }, [selectedWarehouse, selectedCategory, searchProductName]);

  const fetchStocks = async () => {
    try {
      const warehouseId = selectedWarehouse ? selectedWarehouse.value : null;
      const categoryId = selectedCategory ? selectedCategory.value : null;
      const response = await axios.get(`/warehouse-stock`, {
        params: {
          warehouseId: warehouseId,
          categoryId: categoryId,
          productName: searchProductName,
          page: currentPage,
        },
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (response.data && response.data.stocks) {
        const flattenedStocks = [];
        response.data.stocks.forEach((stock) => {
          flattenedStocks.push({
            Warehouse: stock.Warehouse.warehouse_name,
            "Warehouse ID": stock.warehouse_id,
            Category: stock.Product.category.name,
            Image: stock.Product.Image_products[0]?.img_product || "",
            Product: stock.Product.name,
            "Product ID": stock.Product.id,
            Stock: stock.product_stock,
            fullProduct: stock.Product,
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
      const warehouseOptions = [
        { value: "", label: "All Warehouses" },
        ...response.data.warehouses.map((warehouse) => ({
          value: warehouse.id,
          label: warehouse.warehouse_name,
        })),
      ];
      return warehouseOptions;
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      return [];
    }
  };

  const loadCategories = async (inputValue) => {
    console.log("Input value for categories:", inputValue);
    try {
      const response = await axios.get(`/admin/categories`, {
        params: {
          name: inputValue,
        },
      });
      const categoryOptions = [
        { value: "", label: "All Categories" },
        ...response.data.data.map((category) => ({
          value: category.id,
          label: category.name,
        })),
      ];
      return categoryOptions;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const handleAction = (row, action) => {
    const product = {
      warehouseId: row["Warehouse ID"],
      productId: row["Product ID"],
    };
    setSelectedProduct(product);
    switch (action) {
      case "edit":
        setShowUpdateModal(true);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      default:
        console.warn(`Unknown action type: ${action}`);
    }
  };

  const handleSuccessfulEdit = () => {
    fetchStocks();
    setShowUpdateModal(false);
  };

  const handleDetails = (row) => {
    setSelectedProductDetails(row.fullProduct);
    setShowDetailsModal(true);
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
          className={`flex-1 ${adminData.role_id !== 1 ? "hidden" : ""}`}
        />
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadCategories}
          onChange={setSelectedCategory}
          placeholder="Select a category"
          className={`flex-1 ${adminData.role_id !== 1 ? "" : "ml-4"}`}
        />
        <input
          type="text"
          placeholder="Search Product "
          value={searchProductName}
          onChange={(e) => setSearchProductName(e.target.value)}
          className="flex-1 border rounded text-base bg-white border-gray-300 shadow-sm ml-4"
        />
      </div>
      <div className="py-4">
        <TableComponent
          headers={["Product", "Category", "Image", "Warehouse", "Stock"]}
          data={stocks}
          onEdit={(row) => handleAction(row, "edit")}
          onDelete={(row) => handleAction(row, "delete")}
          onTransfer={handleTransfer}
          onDetails={handleDetails}
          showTransfer={true}
          showDetails={true}
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
        warehouseId={selectedProduct?.warehouseId}
        productId={selectedProduct?.productId}
        onSuccessfulDelete={handleSuccessfulDelete}
      />
      <TransferStockModal
        show={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        productId={productToTransfer?.productId}
        fromWarehouseId={productToTransfer?.fromWarehouseId}
        fetchStocks={fetchStocks}
      />
      <ProductDetailsModal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={selectedProductDetails}
      />
    </div>
  );
};

export default StockList;
