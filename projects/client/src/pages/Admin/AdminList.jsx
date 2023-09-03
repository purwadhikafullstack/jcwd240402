import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import RegisterAdminModal from "../../components/Modals/admin/ModalRegisterAdmin";
import Button from "../../components/Button";
import AdminProfileModal from "../../components/Modals/admin/ModalAdminEdit";
import DefaultPagination from "../../components/Pagination";
import moment from "moment";
import withAuthAdmin from "../../components/admin/withAuthAdmin";
import axios from "../../api/axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
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
    setSelectedWarehouse(selectedOption.value);
  };

  const loadWarehouseOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}`
      );
      const warehouseOptions = [
        { value: "", label: "All Warehouses" },
        ...response.data.warehouses.map((warehouse) => ({
          value: warehouse.id,
          label: warehouse.warehouse_name,
        })),
      ];
      return warehouseOptions;
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  const fetchAdmins = async () => {
    try {
      const warehouseId = selectedWarehouse || "";
      const response = await axios.get(
        `/admin/?searchName=${searchName}&warehouseId=${warehouseId}&page=${currentPage}`
      );
      setAdmins(response.data.admins);
      if (response.data.pagination) {
        const { totalPages } = response.data.pagination;
        setTotalPages(totalPages);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      }
    } catch (error) {
      console.error("Error loading admins:", error);
    }
  };

  const formattedAdmins = admins.map((admin) => ({
    id: admin.id,
    username: admin.username,
    "first name": admin.first_name,
    "last name": admin.last_name,
    "warehouse name": admin.warehouse?.warehouse_name,
    "Created at": moment(admin.createdAt).format("MMMM D, YYYY"),
  }));

  const refreshAdminList = async () => {
    await fetchAdmins();
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center">
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadWarehouseOptions}
            onChange={handleWarehouseChange}
            placeholder="All Warehouses"
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
          title={`Edit ${selectedAdmin?.username}`}
          setProfileModalOpen={setProfileModalOpen}
          selectedAdmin={selectedAdmin}
          setPasswordModalOpen={setPasswordModalOpen}
          setWarehouseModalOpen={setWarehouseModalOpen}
          isPasswordModalOpen={isPasswordModalOpen}
          isWarehouseModalOpen={isWarehouseModalOpen}
          refreshAdminList={refreshAdminList}
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

export default withAuthAdmin(AdminList);
