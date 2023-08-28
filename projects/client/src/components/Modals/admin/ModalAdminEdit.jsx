import React from "react";
import { Modal } from "flowbite-react";
import Button from "../../Button";

const AdminProfileModal = ({ show, onClose, title, profileData }) => {
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
          {profileData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-600">
                {item.label}:
              </span>
              <span>{item.value}</span>
              <Button
                onClick={item.onEdit}
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

export default AdminProfileModal;
