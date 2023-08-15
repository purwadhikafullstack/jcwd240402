import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import TableComponent from "../../components/Table";
import SidebarAdmin from "../../components/SidebarAdminDesktop";
import WarehouseModal from "../../components/Modals/ModalWarehouse";
import EditModal from "../../components/Modals/ModalEdit";
import RegisterWarehouseModal from "../../components/Modals/ModalRegisterWarehouse";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import {
  refreshWarehouseList,
  loadCities,
  updateWarehouse,
} from "../../utils/WarehouseListHelp";

const WarehouseList = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [isWarehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [editField, setEditField] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRegisterWarehouseModalOpen, setRegisterWarehouseModalOpen] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const onWarehouseNameChange = (e) => {
    setWarehouseName(e.target.value);
  };

  const openRegisterWarehouseModal = () => {
    setRegisterWarehouseModalOpen(true);
  };

  const openWarehouseModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseModalOpen(true);
  };

  const openEditModal = (field) => {
    setEditField(field);
    setWarehouseModalOpen(false);
    setEditModalOpen(true);
  };

  const refreshWarehouseListWrapper = () => {
    refreshWarehouseList(
      warehouseName,
      selectedCity?.value,
      currentPage,
      setWarehouses,
      setTotalPages
    );
  };

  useEffect(() => {
    refreshWarehouseListWrapper();
  }, [selectedCity, warehouseName, currentPage]);

  const closeModal = () => {
    setSelectedWarehouse(null);
    setWarehouseModalOpen(false);
    refreshWarehouseListWrapper();
  };

  const closeEditModal = () => {
    setEditField(null);
    setEditModalOpen(false);
    refreshWarehouseListWrapper();
  };

  const closeRegisterModal = () => {
    setRegisterWarehouseModalOpen(false);
    refreshWarehouseListWrapper();
  };

  return (
    <div className="shadow-2xl h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
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
          <input
            type="text"
            placeholder="Search Warehouse name"
            value={warehouseName}
            onChange={onWarehouseNameChange}
            className="flex-1 p-2 border rounded text-base bg-white shadow-sm border-gray-200"
            disabled={!selectedCity}
          />
          <Button
            buttonSize="medium"
            buttonText="Register"
            onClick={openRegisterWarehouseModal}
            bgColor="bg-blue3"
            colorText="text-white"
            fontWeight="font-semibold"
          />
        </div>
        <div className="py-4">
          <TableComponent
            headers={[
              "ID",
              "City",
              "Warehouse Name",
              "Warehouse Address",
              "Warehouse Contact",
            ]}
            data={warehouses.map((warehouse) => ({
              warehouse,
              ID: warehouse.id,
              City: warehouse.City.name,
              "Warehouse Name": warehouse.warehouse_name,
              "Warehouse Address": warehouse.address_warehouse,
              "Warehouse Contact": warehouse.warehouse_contact,
            }))}
            onEdit={(row) => openWarehouseModal(row.warehouse)}
          />
          {selectedWarehouse && (
            <WarehouseModal
              show={isWarehouseModalOpen}
              onClose={closeModal}
              title={`Warehouse Details`}
              warehouseData={[
                { label: "City", value: selectedWarehouse.City.name || "" },
                {
                  label: "Warehouse Name",
                  value: selectedWarehouse.warehouse_name || "",
                },
                {
                  label: "Warehouse Address",
                  value: selectedWarehouse.address_warehouse || "",
                },
                {
                  label: "Warehouse Contact",
                  value: selectedWarehouse.warehouse_contact || "",
                },
              ]}
              onEdit={openEditModal}
            />
          )}
          {editField && (
            <EditModal
              show={isEditModalOpen}
              onClose={closeEditModal}
              onSubmit={(value) =>
                updateWarehouse(editField, value, selectedWarehouse)
              }
              label={editField}
              name={editField}
              placeholder={`Enter new ${editField}`}
              initialValue={selectedWarehouse[editField] || ""}
              refreshWarehouseList={refreshWarehouseListWrapper}
            />
          )}
          <RegisterWarehouseModal
            show={isRegisterWarehouseModalOpen}
            onClose={closeRegisterModal}
          />
          <div className="flex justify-center items-center w-full bottom-0 position-absolute">
            <DefaultPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;
