import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import AsyncSelect from "react-select/async";
import { getCookie } from "../../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";

const CreateStock = () => {
  const access_token = getCookie("access_token");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const adminData = useSelector((state) => state.profilerAdmin.value);

  useEffect(() => {
    if (adminData.role_id === 2) {
      setSelectedWarehouse({
        value: adminData.warehouse_id,
        label: adminData?.warehouse?.warehouse_name,
      });
    }
  }, [adminData]);

  const loadWarehouses = async (inputValue) => {
    try {
      const response = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}`
      );
      return response.data.warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.warehouse_name,
      }));
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      return [];
    }
  };

  const loadProducts = async (inputValue) => {
    try {
      const response = await axios.get(`/admin/products`, {
        params: {
          product_name: inputValue,
          page: 1,
          pageSize: 10,
        },
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data.map((product) => ({
        value: product.id,
        label: product.name,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const handleStockCreation = async () => {
    if (!selectedWarehouse) {
      setErrorMessage("Please select a warehouse*");
      return;
    }

    if (!selectedProduct) {
      setErrorMessage("Please select a product*");
      return;
    }

    if (parseInt(stockQuantity, 10) <= 0 || stockQuantity === "") {
      setErrorMessage("Cannot Create Stock ");
      return;
    }

    try {
      const response = await axios.post(
        "/warehouse-stock",
        {
          warehouseId: selectedWarehouse.value,
          productId: selectedProduct.value,
          productStock: stockQuantity,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      alert("Stock created successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating stock:", error);

      if (
        error.response &&
        error.response.data.errors &&
        Array.isArray(error.response.data.errors) &&
        error.response.data.errors.length > 0
      ) {
        setErrorMessage(error.response.data.errors[0].msg);
      } else if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error creating stock.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl mb-4 text-center">Stock Management</h1>
      <div className="lg:w-1/3 mx-auto">
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadWarehouses}
          onChange={setSelectedWarehouse}
          placeholder="Select a warehouse"
          isDisabled={adminData.role_id === 2}
          value={
            adminData.role_id === 2
              ? {
                  value: adminData.warehouse_id,
                  label: adminData?.warehouse?.warehouse_name,
                }
              : selectedWarehouse
          }
          className=""
        />
      </div>
      <div className="lg:w-1/3  mx-auto mt-4">
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadProducts}
          onChange={setSelectedProduct}
          placeholder="Select a product"
          className=""
        />
      </div>
      <div className="flex mt-4 items-center justify-center space-x-4">
        <input
          type="number"
          min="1"
          placeholder="Enter Stock Quantity"
          value={stockQuantity}
          onChange={(e) => {
            if (e.target.value === "" || parseInt(e.target.value, 10) > 0) {
              setStockQuantity(e.target.value);
            }
          }}
          className="p-2 border rounded"
        />
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={handleStockCreation}
        >
          Create Stock
        </button>
      </div>
      {errorMessage && (
        <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
      )}
    </div>
  );
};

export default CreateStock;
