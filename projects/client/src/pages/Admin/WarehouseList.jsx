import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/Table";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import RegisterWarehouseModal from "../../components/Modals/warehouse/ModalRegisterWarehouse";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import {
  loadCitiesAction,
  loadWarehousesAction,
} from "../../features/warehouseListActions";
import WarehouseModal from "../../components/Modals/warehouse/ModalWarehouse";
import WarehouseProfileModal from "../../components/Modals/warehouse/ModalWarehouseEdit";

const WarehouseList = () => {
  const dispatch = useDispatch();
  const warehouses = useSelector((state) => state.warehouse.warehouses) || [];
  const error = useSelector((state) => state.warehouse.error);

  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [editingLabel, setEditingLabel] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [initialEditingValue, setInitialEditingValue] = useState(null);
  const [isWarehouseModalOpen, setWarehouseModalOpen] = useState(false);

  useEffect(() => {
    refreshWarehouseList();
  }, [selectedCity, warehouseName, currentPage]);

  const loadCities = async (inputValue, callback) => {
    const citiesData = await dispatch(loadCitiesAction(inputValue));
    const formattedCities = [
      { value: "", label: "All Cities" },
      ...citiesData.map((city) => ({
        value: city.id,
        label: city.name,
      })),
    ];
    callback(formattedCities);
  };

  const refreshWarehouseList = async () => {
    const cityValue = selectedCity
      ? selectedCity.value !== ""
        ? selectedCity.value
        : null
      : null;
    const response = await dispatch(
      loadWarehousesAction(warehouseName, cityValue, currentPage)
    );
    if (response && response.pagination) {
      setTotalPages(response.pagination.totalPages);
    }
  };

  const handleEdit = (warehouse) => {
    setCurrentWarehouse(warehouse);
    setWarehouseModalOpen(true);
  };

  const handleItemEdit = (label, value) => {
    setEditingField(label);
    setInitialEditingValue({ label: label, value: value });
    setWarehouseModalOpen(false);
    setProfileModalOpen(true);
  };

  const warehouseData = currentWarehouse
    ? [
        { label: "City", value: currentWarehouse.City },
        { label: "Warehouse Name", value: currentWarehouse["Warehouse Name"] },
        {
          label: "Warehouse Address",
          value: currentWarehouse["Warehouse Address"],
        },
        {
          label: "Warehouse Contact",
          value: currentWarehouse["Warehouse Contact"],
        },
      ]
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
            loadOptions={loadCities}
            onChange={setSelectedCity}
            placeholder="City"
            className="flex-1"
          />
          <input
            type="text"
            placeholder="Search Warehouse name"
            value={warehouseName}
            onChange={(e) => setWarehouseName(e.target.value)}
            className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mx-4"
            disabled={!selectedCity}
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
              "City",
              "Warehouse Name",
              "Warehouse Address",
              "Warehouse Contact",
            ]}
            data={warehouses.map((warehouse) => ({
              City: warehouse.City?.name || "",
              "Warehouse Name": warehouse.warehouse_name || "",
              "Warehouse Address": warehouse.address_warehouse || "",
              "Warehouse Contact": warehouse.warehouse_contact || "",
            }))}
            onEdit={handleEdit}
          />
        </div>
        <RegisterWarehouseModal
          show={isRegisterModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          onSuccessfulRegister={refreshWarehouseList}
        />
        <WarehouseModal
          show={isWarehouseModalOpen}
          onClose={() => setWarehouseModalOpen(false)}
          title="Warehouse Details"
          warehouseData={warehouseData}
          onEdit={handleItemEdit}
        />
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {editingField && (
          <WarehouseProfileModal
            show={isProfileModalOpen}
            onClose={() => {
              setProfileModalOpen(false);
              setEditingField(null);
              setInitialEditingValue(null);
            }}
            label={editingField}
            name={editingField}
            placeholder={`Enter ${editingField}`}
            initialValue={initialEditingValue}
            refreshWarehouseList={refreshWarehouseList}
            onSubmit={async (newValue) => {
              console.log("Updated:", editingField, newValue);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default WarehouseList;
