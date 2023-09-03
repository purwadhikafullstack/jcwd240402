import React from "react";
import { Modal } from "flowbite-react";
import Button from "../../Button";
import ReassignWarehouseModal from "./ModalReassignWarehouse";
import ChangePasswordModal from "./ModalEditPassword";

const AdminProfileModal = ({
  show,
  onClose,
  title,
  selectedAdmin,
  setPasswordModalOpen,
  setWarehouseModalOpen,
  isPasswordModalOpen,
  isWarehouseModalOpen,
  refreshAdminList,
  setProfileModalOpen,
}) => {
  const profileData = selectedAdmin
    ? [
        {
          label: "Password",
          value: "Change Password",
          onEdit: () => setPasswordModalOpen(true),
        },
        {
          label: "Warehouse",
          value: selectedAdmin["warehouse name"] || "N/A",
          onEdit: () => setWarehouseModalOpen(true),
        },
      ]
    : [];

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
          <ChangePasswordModal
            show={isPasswordModalOpen}
            onClose={() => setPasswordModalOpen(false)}
            adminId={selectedAdmin?.id}
          />
          {selectedAdmin && (
            <ReassignWarehouseModal
              show={isWarehouseModalOpen}
              onClose={() => setWarehouseModalOpen(false)}
              adminId={selectedAdmin?.id}
              refreshAdminListWrapper={() => {
                refreshAdminList();
                setWarehouseModalOpen(false);
                setProfileModalOpen(false);
              }}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AdminProfileModal;
