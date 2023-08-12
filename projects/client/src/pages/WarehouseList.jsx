import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import TableComponent from "../components/Table";
import Button from "../components/Button";
import SidebarAdmin from "../components/SidebarAdminDesktop";
import RegisterWarehouseModal from "../components/Modals/ModalReassignWarehouse";

const WarehouseList = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const loadCities = (inputValue, callback) => {
    axios
      .get(`http://localhost:8000/api/admin/city/?provinceId=&page=1&searchName=${inputValue}`)
      .then((res) => {
        const results = res.data.cities.map((city) => ({
          value: city.id,
          label: city.name,
        }));
        callback(results);
      });
  };

  const refreshWarehouseList = () => {
    if (selectedCity) {
      axios
        .get(`http://localhost:8000/api/warehouse/warehouse-list?searchName=${warehouseName}&cityId=${selectedCity.value}`)
        .then((res) => {
          setWarehouses(res.data.warehouses);
        });
    }
  };

  useEffect(() => {
    if (selectedCity) {
      setWarehouseName("");
      refreshWarehouseList();
    }
  }, [selectedCity, warehouseName]);

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  const headers = ["ID", "City", "Warehouse Name", "Warehouse Address", "Warehouse Contact"];

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
          <input
            type="text"
            placeholder="Search Warehouse name"
            value={warehouseName}
            onChange={(e) => setWarehouseName(e.target.value)}
            className="flex-1 p-2 border rounded text-base bg-white shadow-sm"
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
        <div className="py-4">
          <TableComponent
            headers={headers}
            data={warehouses.map((warehouse) => ({
              ID: warehouse.id,
              City: warehouse.City.name,
              "Warehouse Name": warehouse.warehouse_name,
              "Warehouse Address": warehouse.address_warehouse,
              "Warehouse Contact": warehouse.warehouse_contact,
            }))}
          />
          <RegisterWarehouseModal
            show={isRegisterModalOpen}
            onClose={() => setRegisterModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default WarehouseList;
