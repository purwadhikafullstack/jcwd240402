import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/Table";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import RegisterAdminModal from "../../components/Modals/admin/ModalRegisterAdmin";
import Button from "../../components/Button";
import AdminProfileModal from "../../components/Modals/admin/ModalAdminEdit";
import ChangePasswordModal from "../../components/Modals/admin/ModalEditPassword";
import ReassignWarehouseModal from "../../components/Modals/admin/ModalReassignWarehouse";
import DefaultPagination from "../../components/Pagination";
import {loadWarehousesAction, loadAdminsAction} from "../../features/adminListActions";
import moment from "moment";

const AdminList = () => {
  const dispatch = useDispatch();
  const { warehouses, admins, error } = useSelector((state) => state.admin);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchName, setSearchName] = useState("");

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isWarehouseModalOpen, setWarehouseModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  
  useEffect(() => {
    refreshAdminList();
  }, [searchName, selectedWarehouse, currentPage]);

  const handleWarehouseChange = (selectedOption) => {
    setSelectedWarehouse(selectedOption.value === "" ? null : selectedOption);
  };

  const refreshAdminList = async () => {
    const warehouseValue = selectedWarehouse ? selectedWarehouse.value : null;
    const response = await dispatch(
      loadAdminsAction(searchName, warehouseValue, currentPage)
    );
    if (response && response.pagination) {
      const { totalPages } = response.pagination;
      setTotalPages(totalPages);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }
    return response;
  };

  const loadWarehouses = async (inputValue, callback) => {
    await dispatch(loadWarehousesAction(inputValue));
    const formattedWarehouses = [
      { value: "", label: "All Warehouses" },
      ...warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.warehouse_name,
      })),
    ];
    callback(formattedWarehouses);
  };

  const formattedAdmins = admins.map((admin) => ({
    id: admin.id,
    username: admin.username,
    "first name": admin.first_name,
    "last name": admin.last_name,
    "warehouse name": admin.warehouse?.warehouse_name,
    "Created at": moment(admin.createdAt).format("MMMM D, YYYY"),
  }));

  const profileData = selectedAdmin
    ? [
        { label: "Password", value: "••••••••", onEdit: setPasswordModalOpen.bind(null, true),},
        {label: "Warehouse",value: selectedAdmin["warehouse name"] || "",onEdit: setWarehouseModalOpen.bind(null, true),},]
    : [];

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center">
          <AsyncSelect
            cacheOptions
            loadOptions={loadWarehouses}
            onChange={handleWarehouseChange}
            placeholder="Warehouse"
            className="flex-1"
          />
          <input
            type="text"
            placeholder="Search Admin name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mx-4"
          />
          <Button
            buttonSize="medium"
            buttonText="Register"
            onClick={() => setRegisterModalOpen(true)}
            bgColor="bg-blue3"
            colorText="text-white"
            fontWeight="font-semibold"
          />
        </div>
        <div className="py-4">
          <TableComponent
            headers={[
              "id",
              "username",
              "first name",
              "last name",
              "warehouse name",
              "Created at",
            ]}
            data={formattedAdmins}
            onEdit={(admin) => {
              setSelectedAdmin(admin);
              setProfileModalOpen(true);
            }}
          />
        </div>
        <RegisterAdminModal
          show={isRegisterModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          onSuccessfulRegister={() => {
            refreshAdminList();
            setRegisterModalOpen(false);
          }}
        />
        <AdminProfileModal
          show={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title="Edit Admin"
          adminData={selectedAdmin}
          profileData={profileData}
        />
        <ChangePasswordModal
          show={isPasswordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          adminId={selectedAdmin?.id}
        />
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
        <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminList;
