import React, { useState } from "react";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import Button from "../../Button";

const TransferStockModal = ({
  show,
  onClose,
  productId,
  fromWarehouseId,
  fetchStocks,
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [quantity, setQuantity] = useState("");

  const loadWarehouses = async (inputValue) => {
    try {
      const response = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}&cityId=`
      );
      const results = response.data.warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.warehouse_name,
      }));
      return results.length ? results : [];
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  const handleTransfer = () => {
    const payload = {
      fromWarehouseId: fromWarehouseId,
      toWarehouseId: selectedWarehouse.value,
      productId: productId,
      quantity: quantity,
    };

    axios
      .post("http://localhost:8000/api/admin/stock-transfer", payload)
      .then(() => {
        onClose();
        fetchStocks();
      })
      .catch((error) => {
        console.error("Transfer failed:", error.response?.data || error);
      });
  };

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900">Transfer Stock</h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="px-6 grid gap-y-3">
          <div className="flex-1">
            <AsyncSelect
              classNamePrefix="react-select"
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
