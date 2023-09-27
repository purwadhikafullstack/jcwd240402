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
import useURLParams from "../../utils/useUrlParams";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";

const AdminList = () => {
  const { syncStateWithParams, setParam } = useURLParams();
  const [selectedAdminToDelete, setSelectedAdminToDelete] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isWarehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const access_token = getCookie("access_token");
  const loadWarehouseOptions = useWarehouseOptions();
  const [searchName, setSearchName] = useState(
    syncStateWithParams("searchName", "")
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    syncStateWithParams("warehouseId", "")
  );
  const [currentPage, setCurrentPage] = useState(
    syncStateWithParams("page", 1)
  );

  useEffect(() => {
    const pageParam = syncStateWithParams("page", null);
    setCurrentPage(pageParam !== null ? parseInt(pageParam) : 1);
  }, []);

  const handleWarehouseChange = (selectedOption) => {
    setSelectedWarehouse(selectedOption.value);
    resetPage();
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    setParam("searchName", searchName);
    setParam("warehouseId", selectedWarehouse);
    setParam("page", currentPage);
    fetchAdmins();
  }, [searchName, selectedWarehouse, currentPage]);

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
      <div className="flex lg:flex-none ">
        <SidebarAdminMobile />
        <div className="lg:px-8 lg:pt-8 lg:w-full mt-4 mx-4">
          <div className="flex items-center">
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadWarehouseOptions}
              onChange={handleWarehouseChange}
              placeholder="All Warehouses"
              className="lg:flex-1 relative z-50"
            />
            <input
              type="text"
              placeholder="Search Admin name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="lg:flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mx-4"
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
          <div className="py-4 mr-4">
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
                setSelectedAdminToDelete(admin);
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
            adminId={selectedAdminToDelete?.id}
            adminName={
              selectedAdminToDelete?.username || selectedAdminToDelete?.name
            }
          />
          <div className="flex justify-center items-center w-full bottom-0 position-absolute">
            <DefaultPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdmin(AdminList);
