import React from "react";
import { Modal } from "flowbite-react";
import Button from "../../Button";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";

const ConfirmDeleteStock = ({
  show,
  onClose,
  warehouseId,
  productId,
  onSuccessfulDelete,
  productName,
}) => {
  const handleDelete = async () => {
    const access_token = getCookie("access_token");
    try {
      const response = await axios.delete(
        `/warehouse-stock/${warehouseId}/${productId}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.status === 200) {
        onClose();
        onSuccessfulDelete();
      }
    } catch (error) {
      console.error("Failed to delete stock:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Modal show={show} size="sm" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Confirm Deletion
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete  <strong>{productName}</strong> stock?</p>
        <div className="flex justify-center mt-4 gap-4">
          <Button
            buttonSize="medium"
            buttonText="Cancel"
            bgColor="bg-gray-300"
            colorText="text-gray-700"
            fontWeight="font-semibold"
            onClick={onClose}
          />
          <Button
            buttonSize="medium"
            buttonText="Delete"
            bgColor="bg-red-500"
            colorText="text-white"
            fontWeight="font-semibold"
            onClick={handleDelete}
            className="ml-4"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteStock;
