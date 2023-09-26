import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import TableComponent from "../../components/Table";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import RegisterWarehouseModal from "../../components/modal/warehouse/ModalRegisterWarehouse";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import withAuthAdmin from "../../components/admin/withAuthAdmin";
import ConfirmDeleteWarehouse from "../../components/modal/warehouse/ModalDeleteWarehouse";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";
import useURLParams from "../../utils/useUrlParams"; // Import your custom hook

const WarehouseList = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteWarehouseId, setDeleteWarehouseId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Use the custom useURLParams hook
  const { syncStateWithParams, setParam } = useURLParams();

  // Use syncStateWithParams to initialize your state based on URL parameters
  const [selectedCity, setSelectedCity] = useState(
    syncStateWithParams("city", null)
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    syncStateWithParams("warehouse", null)
  );
  const [currentPage, setCurrentPage] = useState(
    syncStateWithParams("page", 1)
  );

  useEffect(() => {
    const pageParam = syncStateWithParams("page", null);
    setCurrentPage(pageParam !== null ? parseInt(pageParam) : 1);
  }, []);

  // Function to fetch warehouses based on filters and pagination
  const fetchWarehouses = async () => {
    const { value: cityId = "" } = selectedCity || {};
    const response = await axios.get(`/warehouse/warehouse-list`, {
      params: {
        searchName: selectedWarehouse?.label || "",
        cityId,
        page: currentPage,
        pageSize: 10,
      },
    });
    setWarehouses(response.data.warehouses);
    const { totalPages } = response.data.pagination || {};
    if (totalPages) {
      setTotalPages(totalPages);
      if (currentPage > totalPages) setCurrentPage(totalPages);
    }
  };

  // Function to handle editing a warehouse
  const handleEdit = (warehouse) => {
    navigate(`/admin/edit/${warehouse["Warehouse Name"]}`);
  };

  // Use this function to update URL parameters and state when the user selects a city
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
    setParam("city", city);
  };

  // Use this function to update URL parameters and state when the user enters a warehouse name
  const handleWarehouseNameChange = (event) => {
    const warehouseName = event.target.value;
    setSelectedWarehouse(warehouseName ? { label: warehouseName } : null);
    setCurrentPage(1);
    setParam("warehouse", warehouseName);
  };

  useEffect(() => {
    fetchWarehouses();
  }, [selectedCity, selectedWarehouse, currentPage]);

  const formattedWarehouses = warehouses.map((warehouse) => ({
    id: warehouse.id,
    city: warehouse.City?.name || "",
    province: warehouse.City?.Province.name,
    "Warehouse Name": warehouse.warehouse_name || "",
    "Warehouse Address": warehouse.address_warehouse || "",
    "Warehouse Contact": warehouse.warehouse_contact || "",
  }));

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <Sidebar />
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="lg:px-8 lg:pt-8 lg:w-full mt-4 mx-4">
          <div className="flex items-center mx-4">
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={(inputValue, callback) => {
                axios
                  .get(
                    `/admin/city/?provinceId=&page=1&searchName=${inputValue}`
                  )
                  .then((response) => {
                    const cityOptions = [
                      { value: "", label: "All Cities" },
                      ...response.data.cities.map((city) => ({
                        value: city.id,
                        label: city.name,
                      })),
                    ];
                    callback(cityOptions);
                  })
                  .catch((error) => {
                    callback([]);
                  });
              }}
              onChange={handleCityChange}
              value={selectedCity}
              placeholder="All Cities"
              className="flex-1"
            />
            <input
              type="text"
              placeholder="Search Warehouse name"
              value={selectedWarehouse?.label || ""}
              onChange={handleWarehouseNameChange}
              className="flex-1 mx-4 p-2 border rounded text-base bg-white border-gray-300 shadow-sm"
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
          <div className="py-4 mx-4">
            <TableComponent
              headers={[
                "province",
                "city",
                "Warehouse Name",
                "Warehouse Address",
                "Warehouse Contact",
              ]}
              data={formattedWarehouses}
              onEdit={handleEdit}
              onDelete={(warehouse) => {
                setDeleteWarehouseId(warehouse.id);
                setDeleteModalOpen(true);
              }}
            />
          </div>
          <RegisterWarehouseModal
            show={isRegisterModalOpen}
            onClose={() => {
              setRegisterModalOpen(false);
              fetchWarehouses();
            }}
          />
          <ConfirmDeleteWarehouse
            show={isDeleteModalOpen}
            warehouseId={deleteWarehouseId}
            onClose={() => setDeleteModalOpen(false)}
            handleSuccessfulDelete={() => {
              fetchWarehouses();
              setDeleteModalOpen(false);
            }}
          />
          <div className="flex justify-center items-center w-full bottom-0 position-absolute mb-4">
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

export default withAuthAdmin(WarehouseList);
