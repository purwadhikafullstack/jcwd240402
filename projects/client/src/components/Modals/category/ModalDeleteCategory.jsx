import React from "react";
import { Modal } from "flowbite-react";
import Button from "../../Button"; 

const ConfirmDeleteModal = ({ show, onClose, onDeleteConfirm }) => {
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
        <p>Are you sure you want to delete this category?</p>
        <div className="flex justify-center mt-4">
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
            onClick={onDeleteConfirm}
            className="ml-4"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteModal;
