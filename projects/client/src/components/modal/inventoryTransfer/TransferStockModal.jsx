import React, { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import Button from "../../Button";
import { getCookie } from "../../../utils/tokenSetterGetter";

const TransferStockModal = ({ show, onClose, product, fetchStocks }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const access_token = getCookie("access_token");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!show) {
      setSelectedWarehouse(null);
      setQuantity("1");
      setErrorMessage(null);
    }
  }, [show]);

  const loadWarehouses = async (inputValue) => {
    try {
      const response = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}&cityId=`
      );
      let results = response.data.warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.warehouse_name,
      }));
      results = results.filter(
        (warehouse) => warehouse.value !== product.fromWarehouseId
      );
      return results.length ? results : [];
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  const handleTransfer = () => {
    const payload = {
      fromWarehouseId: product.fromWarehouseId,
      toWarehouseId: selectedWarehouse.value,
      productId: product.productId,
      quantity: quantity,
    };

    axios
      .post("/admin/stock-transfer", payload, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then(() => {
        onClose();
        fetchStocks();
      })
      .catch((error) => {
        console.error("Transfer failed:", error.response?.data || error);
        setErrorMessage(error.response?.data.message || "Transfer failed");
      });
  };

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header className="flex justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 text-center">Transfer Stock</h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        <div className="px-6 grid gap-y-3">
          <div className="flex-1">
            <AsyncSelect
              classNamePrefix="react-select"
              defaultOptions
              loadOptions={loadWarehouses}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Select destination warehouse"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              defaultValue="1"
            />
          </div>
          <div className="flex flex-col justify-center items-center mt-3">
            <Button
              type="button"
              buttonSize="medium"
              buttonText="Transfer"
              bgColor="bg-blue3"
              colorText="text-white"
              fontWeight="font-semibold"
              onClick={handleTransfer}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TransferStockModal;
