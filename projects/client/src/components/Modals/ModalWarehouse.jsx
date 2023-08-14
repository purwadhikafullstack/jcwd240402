import React from "react";
import { Modal } from "flowbite-react";
import Button from "../Button";

const WarehouseModal = ({ show, onClose, title, warehouseData, onEdit }) => {
  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {title || "Default Title"}
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {warehouseData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-600">
                {item.label}:
              </span>
              <span>{item.value}</span>
              <Button
                onClick={() => onEdit(item.label)}
                buttonSize="small"
                buttonText="Edit"
                bgColor="bg-blue3"
                colorText="text-white"
                fontWeight="font-semibold"
              />
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WarehouseModal;

