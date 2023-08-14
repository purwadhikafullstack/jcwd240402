import React, { useState, useEffect, useCallback } from "react";
import AsyncSelect from "react-select/async";
import TableComponent from "../../components/Table";
import Button from "../../components/Button";
import SidebarAdmin from "../../components/SidebarAdminDesktop";
import AdminProfileModal from "../../components/Modals/ModalAdminEdit";
import ChangePasswordModal from "../../components/Modals/ModalEditPassword";
import ReassignWarehouseModal from "../../components/Modals/ModalReassignWarehouse";
import RegisterAdminModal from "../../components/Modals/ModalRegisterAdmin";
import DefaultPagination from "../../components/Pagination";
import {
  loadCities,
  loadWarehouses,
  refreshAdminList,
} from "../../utils/AdminListHelp";

const AdminListPage = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);
  const [isReassignModalOpen, setReassignModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const refreshAdminListWrapper = useCallback(
    (newPage) => {
      refreshAdminList(
        selectedCity,
        selectedWarehouse,
        adminName,
        newPage,
        admins,
        setAdmins,
        setPagination
      );
    },
    [selectedCity, selectedWarehouse, adminName, admins]
  );

  useEffect(() => {
    if (selectedCity) {
      setSelectedWarehouse(null);
      setAdminName("");
    }
  }, [selectedCity]);

  useEffect(() => {
    refreshAdminListWrapper();
  }, [refreshAdminList, selectedWarehouse, adminName]);

  const onEdit = (row) => {
    setSelectedAdmin(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAdmin(null);
    setModalOpen(false);
    refreshAdminList();
  };

  const closeChangePasswordModal = () => {
    setChangePasswordModalOpen(false);
    refreshAdminList();
  };

  const closeReassignModal = () => {
    setReassignModalOpen(false);
    refreshAdminList();
  };

  const onEditPassword = () => {
    setModalOpen(false);
    setChangePasswordModalOpen(true);
    setReassignModalOpen(false);
  };

  const onEditWarehouse = () => {
    setModalOpen(false);
    setChangePasswordModalOpen(false);
    setReassignModalOpen(true);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  const profileData = selectedAdmin
    ? [
        { label: "Password", value: "••••••••", onEdit: onEditPassword },
        {
          label: "Warehouse",
          value: selectedAdmin["Warehouse Name"] || "",
          onEdit: onEditWarehouse,
        },
      ]
    : [];

  const headers = [
    "ID",
    "Username",
    "First Name",
    "Last Name",
    "Warehouse Name",
    "Warehouse Contact",
  ];

  return (
    <div className="bg-blue1 h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdmin />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center ">
          <div className="flex-1">
            <AsyncSelect
              classNamePrefix="react-select"
              loadOptions={loadCities}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="City"
            />
          </div>
          <div className="flex-1">
            <AsyncSelect
              classNamePrefix="react-select"
              loadOptions={(inputValue, callback) =>
                loadWarehouses(inputValue, selectedCity, callback)
              }
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Warehouse"
            />
          </div>
          <input
            type="text"
            placeholder="Search Admin name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="flex-1 p-2 border rounded text-base bg-white shadow-sm"
            disabled={!selectedCity || !selectedWarehouse}
          />
          <Button
            buttonSize="medium"
            buttonText="Register"
            onClick={openRegisterModal}
            bgColor="bg-blue3"
            colorText="text-white"
            fontWeight="font-semibold"
          />
        </div>
        <div className="py-4">
          <TableComponent
            headers={headers}
            data={admins.map((admin) => ({
              ID: admin.id,
              Username: admin.username,
              "First Name": admin.first_name,
              "Last Name": admin.last_name,
              "Warehouse Name": admin.warehouse.warehouse_name,
              "Warehouse Contact": admin.warehouse.warehouse_contact,
            }))}
            onEdit={onEdit}
          />
          <AdminProfileModal
            show={isModalOpen}
            onClose={closeModal}
            title={`Editing ${
              selectedAdmin ? selectedAdmin.Username : "Warehouse"
            }`}
            profileData={profileData}
          />
          <ChangePasswordModal
            show={isChangePasswordModalOpen}
            onClose={closeChangePasswordModal}
            adminId={selectedAdmin ? selectedAdmin.ID : null}
          />
          <ReassignWarehouseModal
            show={isReassignModalOpen}
            onClose={closeReassignModal}
            adminId={selectedAdmin ? selectedAdmin.ID : null}
            refreshAdminListWrapper={refreshAdminListWrapper}
          />
          <RegisterAdminModal
            show={isRegisterModalOpen}
            onClose={() => setRegisterModalOpen(false)}
            refreshAdminListWrapper={refreshAdminListWrapper}
          />
          <div className="flex justify-center items-center w-full bottom-0">
            <DefaultPagination
              totalPages={pagination.totalPages}
              onPageChange={refreshAdminListWrapper}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListPage;
