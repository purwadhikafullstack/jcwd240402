import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import TableComponent from "../../components/Table";
import SidebarAdmin from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
// import RegisterWarehouseModal from "../../components/Modals/ModalRegisterWarehouse";
import {
  loadCitiesAction,
  loadWarehousesAction,
} from "../../features/warehouseListActions";

const WarehouseList = () => {
  const dispatch = useDispatch();

  const warehouses = useSelector((state) => state.warehouse.warehouses) || [];
  const totalPages = useSelector((state) => state.warehouse.totalPages);
  const error = useSelector((state) => state.warehouse.error);

  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [registerWarehouse,setRegisterWarehouse] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);

  const onWarehouseNameChange = (e) => {
    setWarehouseName(e.target.value);
  };

  const openRegisterModal = () => {
    setRegisterWarehouse(true);
  };

  const closeRegisterModal = () => {
    setRegisterWarehouse(false);
  };

  const loadCities = async (inputValue, callback) => {
    try {
      const citiesData = await dispatch(loadCitiesAction(inputValue));
      const formattedCities = citiesData.map((city) => ({
        value: city.id,
        label: city.name,
      }));
      callback(formattedCities);
    } catch (e) {
      console.error("Error loading cities:", e);
    }
  };

  const refreshWarehouseListWrapper = () => {
    if (selectedCity) {
      dispatch(
        loadWarehousesAction(warehouseName, selectedCity.value, currentPage)
      );
    }
  };

  useEffect(() => {
    refreshWarehouseListWrapper();
  }, [selectedCity, warehouseName, currentPage]);

  const tableHeaders = [
    "ID",
    "City",
    "Warehouse Name",
    "Warehouse Address",
    "Warehouse Contact",
  ];

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
              isClearable={true}
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
            onClick={openRegisterModal}
            bgColor="bg-blue3"
            colorText="text-white"
            fontWeight="font-semibold"
          />
        </div>
        <TableComponent
          headers={tableHeaders}
          data={warehouses.map((warehouse) => ({
            ID: warehouse.id || "",
            City: warehouse.City?.name || "",
            "Warehouse Name": warehouse.warehouse_name || "",
            "Warehouse Address": warehouse.address_warehouse || "",
            "Warehouse Contact": warehouse.warehouse_contact || "",
          }))}
          onEdit={(rowData) => {
            console.log("Edit clicked for:", rowData);
          }}
        />
        {/* Uncomment this if you want pagination back
        <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
        */}
        {/* Display error if it exists */}
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default WarehouseList;
