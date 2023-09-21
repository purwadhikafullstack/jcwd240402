import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import RegisterAdminModal from "../../components/modal/admin/ModalRegisterAdmin";
import ConfirmDeleteAdmin from "../../components/modal/admin/ModalDeleteAdmin";
import Button from "../../components/Button";
import AdminProfileModal from "../../components/modal/admin/ModalAdminEdit";
import DefaultPagination from "../../components/Pagination";
import moment from "moment";
import withAuthAdmin from "../../components/admin/withAuthAdmin";
import axios from "../../api/axios";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useWarehouseOptions } from "../../utils/loadWarehouseOptions";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isWarehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const access_token = getCookie("access_token");
  const loadWarehouseOptions = useWarehouseOptions();

  useEffect(() => {
    refreshAdminList();
  }, [searchName, selectedWarehouse, currentPage]);

  const handleWarehouseChange = (selectedOption) => {
    setSelectedWarehouse(selectedOption.value);
  };

  const fetchAdmins = async () => {
    try {
      const warehouseId = selectedWarehouse || "";
      const response = await axios.get(
        `/admin/?searchName=${searchName}&warehouseId=${warehouseId}&page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
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
    if (formattedAdmins.length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
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
            onDelete={(admin) => {
              setSelectedAdminId(admin.id);
              setShowDeleteModal(true);
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
        <ConfirmDeleteAdmin
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          handleSuccessfulDelete={() => {
            refreshAdminList();
            setShowDeleteModal(false);
          }}
          adminId={selectedAdminId}
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
