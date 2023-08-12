import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import TableComponent from "../components/Table";
import Button from "../components/Button";
import SidebarAdmin from "../components/SidebarAdminDesktop";
import AdminProfileModal from "../components/Modals/ModalAdminEdit";
import ChangePassword from "../components/Modals/ModalEditPassword";
import ReassignWarehouseModal from "../components/Modals/ModalReassignWarehouse";
import RegisterAdminModal from "../components/Modals/ModalRegisterAdmin";

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

  const loadCities = (inputValue, callback) => {
    axios
      .get(
        `http://localhost:8000/api/admin/city/?provinceId=&page=1&searchName=${inputValue}`
      )
      .then((res) => {
        const results = res.data.cities.map((city) => ({
          value: city.id,
          label: city.name,
        }));
        callback(results);
      });
  };

  const loadWarehouses = (inputValue, callback) => {
    if (!selectedCity || !inputValue) return callback([]);
    axios
      .get(
        `http://localhost:8000/api/warehouse/warehouse-list?searchName=${inputValue}&cityId=${selectedCity.value}`
      )
      .then((res) => {
        const results = res.data.warehouses.map((warehouse) => ({
          value: warehouse.id,
          label: warehouse.warehouse_name,
        }));
        callback(results.length ? results : []);
      });
  };

  const refreshAdminList = () => {
    if (selectedCity && selectedWarehouse) {
      axios
        .get(
          `http://localhost:8000/api/admin/?searchName=${adminName}&warehouseId=${selectedWarehouse.value}`
        )
        .then((res) => {
          setAdmins(res.data.admins);
        });
    }
  };

  useEffect(() => {
    if (selectedCity) {
      setSelectedWarehouse(null);
      setAdminName("");
    }
  }, [selectedCity]);

  useEffect(() => {
    refreshAdminList();
  }, [selectedWarehouse, adminName]);

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
        {
          label: "Password",
          onEdit: onEditPassword,
        },
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
              loadOptions={loadWarehouses}
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
          <ChangePassword
            show={isChangePasswordModalOpen}
            onClose={closeChangePasswordModal}
            adminId={selectedAdmin ? selectedAdmin.ID : null}
          />
          <ReassignWarehouseModal
            show={isReassignModalOpen}
            onClose={closeReassignModal}
            adminId={selectedAdmin ? selectedAdmin.ID : null}
          />
          <RegisterAdminModal
            show={isRegisterModalOpen}
            onClose={() => setRegisterModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminListPage;
