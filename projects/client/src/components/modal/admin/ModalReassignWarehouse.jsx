import React, { useState } from "react";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import Button from "../../Button";
import { getCookie } from "../../../utils/tokenSetterGetter";

const ReassignWarehouseModal = ({
  show,
  onClose,
  adminId,
  refreshAdminListWrapper,
}) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const access_token = getCookie("access_token");

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

  const handleReassign = () => {
    if (selectedWarehouse && adminId) {
      const payload = { warehouse_id: selectedWarehouse.value };
      axios
        .patch(`/admin/assign-warehouse/${adminId}`, payload, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setSelectedWarehouse(null);
          onClose();
          refreshAdminListWrapper();
        })
        .catch((error) => {
          console.error("Reassignment failed:", error.response?.data || error);
        });
    } else {
      console.warn("Cannot reassign without selecting a warehouse or admin ID");
    }
  };

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Reassign Warehouse
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="px-6 grid gap-y-3">
          <div className="flex-1">
            <AsyncSelect
              classNamePrefix="react-select"
              defaultOptions
              loadOptions={loadWarehouses}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Search for Warehouse by Name"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                  position: "fixed",
                }),
              }}
              className="relative z-50"
            />
          </div>
          <div className="flex flex-col justify-center items-center mt-3">
            <Button
              type="button"
              buttonSize="medium"
              buttonText="Reassign"
              bgColor="bg-blue3"
              colorText="text-white"
              fontWeight="font-semibold"
              onClick={handleReassign}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReassignWarehouseModal;
