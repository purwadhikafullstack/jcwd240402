import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import RegisterWarehouseModal from "../../components/Modals/warehouse/ModalRegisterWarehouse";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import WarehouseModal from "../../components/Modals/warehouse/ModalWarehouse";
import WarehouseProfileModal from "../../components/Modals/warehouse/ModalWarehouseEdit";
import axios from "../../api/axios";
import withAuthAdmin from '../../components/admin/withAuthAdmin';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    refreshWarehouseList();
  }, [selectedCity, warehouseName, selectedWarehouse, currentPage]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handleWarehouseChange = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setCurrentPage(1);
  };

  const loadCities = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `/admin/city/?provinceId=&page=1&searchName=${inputValue}`
      );
      const cityOptions = [
        { value: "", label: "All Cities" },
        ...response.data.cities.map((city) => ({
          value: city.id,
          label: city.name,
        })),
      ];
  
      callback(cityOptions);
    } catch (error) {
      console.error("Error loading cities:", error);
      callback([]);
    }
  };

  const loadWarehouseOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}&cityId=${selectedCity?.value || ""}`
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

  const fetchWarehouses = async () => {
    try {
      const cityId = selectedCity ? selectedCity.value : "";
      const response = await axios.get(
        `/warehouse/warehouse-list`,
        {
          params: {
            searchName: warehouseName,
            cityId: cityId,
            page: currentPage,
            pageSize: 10,
          },
        }
      );
      setWarehouses(response.data.warehouses);
      if (response.data.pagination) {
        const { totalPages } = response.data.pagination;
        setTotalPages(totalPages);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      }
    } catch (error) {
      console.error("Error loading warehouses:", error);
    }
  };

  const formattedWarehouses = warehouses.map((warehouse) => ({
    city: warehouse.City?.name || "",
    "Warehouse Name": warehouse.warehouse_name || "",
    "Warehouse Address": warehouse.address_warehouse || "",
    "Warehouse Contact": warehouse.warehouse_contact || "",
  }));

  const refreshWarehouseList = async () => {
    await fetchWarehouses();
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
            loadOptions={loadCities}
            onChange={handleCityChange}
            placeholder="All Cities"
            className="flex-1"
          />
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadWarehouseOptions}
            onChange={handleWarehouseChange}
            placeholder="All Warehouses"
            className="flex-1 mx-4"
            value={selectedWarehouse}
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
              "city",
              "Warehouse Name",
              "Warehouse Address",
              "Warehouse Contact",
            ]}
            data={formattedWarehouses}
            onEdit={(warehouse) => {
              // Handle edit action for warehouse
            }}
          />
        </div>
        <RegisterWarehouseModal
          show={isRegisterModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          onSuccessfulRegister={() => {
            refreshWarehouseList();
            setRegisterModalOpen(false);
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

export default withAuthAdmin(WarehouseList);

