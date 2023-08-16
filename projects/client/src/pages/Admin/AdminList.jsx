import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/Table";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import RegisterAdminModal from "../../components/Modals/ModalRegisterAdmin";
import Button from "../../components/Button";
import AdminProfileModal from "../../components/Modals/ModalAdminEdit";
import ChangePasswordModal from "../../components/Modals/ModalEditPassword";
import ReassignWarehouseModal from "../../components/Modals/ModalReassignWarehouse";
import DefaultPagination from "../../components/Pagination";
import {
  loadCitiesAction,
  loadWarehousesAction,
  loadAdminsAction,
} from "../../utils/Actions";

const AdminList = () => {
  const dispatch = useDispatch();
  const { cities, warehouses, admins, error } = useSelector(
    (state) => state.admin
  );
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isWarehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadCities = async (inputValue, callback) => {
    const citiesData = await dispatch(loadCitiesAction(inputValue));
    const formattedCities = citiesData.map((city) => ({
      value: city.id,
      label: city.name,
    }));
    callback(formattedCities);
  };

  const loadWarehouses = async (inputValue, callback) => {
    if (selectedCity) {
      await dispatch(loadWarehousesAction(inputValue, selectedCity.value));
      const formattedWarehouses = warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.warehouse_name,
      }));
      callback(formattedWarehouses);
    }
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setRegisterModalOpen(false);
  };

  const onEditPassword = () => {
    setPasswordModalOpen(true);
  };

  const onEditWarehouse = () => {
    setWarehouseModalOpen(true);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSuccessfulRegister = async () => {
    await refreshAdminList();
    closeRegisterModal(); 
};

const handleSuccessfulEdit = async () => {
  await refreshAdminList();
  setWarehouseModalOpen(false);
  setProfileModalOpen(false);
};

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setProfileModalOpen(true);
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      if (selectedWarehouse) {
        const response = await dispatch(
          loadAdminsAction(searchName, selectedWarehouse.value, currentPage)
        );
        if (response && response.pagination) {
          const { page, totalPages } = response.pagination;
          setCurrentPage(page);
          setTotalPages(totalPages);
        }
      }
    };

    fetchAdmins();
  }, [selectedWarehouse, searchName, dispatch, currentPage]);

  const refreshAdminList = async () => {
    if (selectedWarehouse) {
      const response = await dispatch(loadAdminsAction(searchName, selectedWarehouse.value, currentPage));
      if (response && response.pagination) {
        const { totalPages } = response.pagination;
        setTotalPages(totalPages);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      }
      return response;
    }
  };

  const formattedAdmins = admins.map((admin) => ({
    id: admin.id,
    username: admin.username,
    "first name": admin.first_name,
    "last name": admin.last_name,
    "warehouse name": admin.warehouse?.warehouse_name,
  }));

  const profileData = selectedAdmin
    ? [
        { label: "Password", value: "••••••••", onEdit: onEditPassword },
        {
          label: "Warehouse",

          value: selectedAdmin["warehouse name"] || "",
          onEdit: onEditWarehouse,
        },
      ]
    : [];
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className=" h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center ">
          <div className="flex-1">
            <AsyncSelect
              cacheOptions={false}
              loadOptions={loadCities}
              onChange={(city) => {
                setSelectedCity(city);
              }}
              placeholder="City"
            />
          </div>
          <div className="flex-1">
            <AsyncSelect
              minLength={1}
              cacheOptions
              loadOptions={loadWarehouses}
              onChange={(warehouse) => {
                setSelectedWarehouse(warehouse);
              }}
              placeholder="Warehouse"
            />
          </div>
          <input
            type="text"
            placeholder="Search Admin name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
            headers={[
              "id",
              "username",
              "first name",
              "last name",
              "warehouse name",
            ]}
            data={formattedAdmins}
            onEdit={handleEditAdmin}
          />
        </div>
        <RegisterAdminModal
          show={isRegisterModalOpen}
          onClose={closeRegisterModal}
          onSuccessfulRegister={handleSuccessfulRegister}
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
          refreshAdminListWrapper={handleSuccessfulEdit}
        />
        <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminList;
