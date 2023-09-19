import React from "react";
import { Modal } from "flowbite-react";
import Button from "../../Button";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";

const ConfirmDeleteAdmin = ({ show, onClose, handleSuccessfulDelete, adminId }) => {
  const access_token = getCookie("access_token");

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/admin/${adminId}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      if (response.status === 200) {
        alert('Admin deleted successfully!');
        handleSuccessfulDelete();
        onClose();
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      alert(errorMessage);
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
        <p>Are you sure you want to delete this admin?</p>
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
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteAdmin;