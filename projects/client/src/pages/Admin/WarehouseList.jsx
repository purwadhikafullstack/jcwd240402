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

const WarehouseList = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteWarehouseId, setDeleteWarehouseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const handleEdit = (warehouse) => {
    navigate(`/edit/${warehouse["Warehouse Name"]}`);
  };

  useEffect(() => {
    fetchWarehouses();
  }, [selectedCity, selectedWarehouse, currentPage]);

  const formattedWarehouses = warehouses.map((warehouse) => ({
    id: warehouse.id,
    city: warehouse.City?.name || "",
    "Warehouse Name": warehouse.warehouse_name || "",
    "Warehouse Address": warehouse.address_warehouse || "",
    "Warehouse Contact": warehouse.warehouse_contact || "",
  }));

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <Sidebar />
      <div className="px-8 pt-8">
        <div className="flex items-center">
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={(inputValue, callback) => {
              axios
                .get(`/admin/city/?provinceId=&page=1&searchName=${inputValue}`)
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
            onChange={(city) => {
              setSelectedCity(city);
              setCurrentPage(1);
            }}
            placeholder="All Cities"
            className="flex-1"
          />
          <input
            type="text"
            placeholder="Search Warehouse name"
            value={selectedWarehouse?.label || ""}
            onChange={(e) => setSelectedWarehouse({ label: e.target.value })}
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
        <div className="py-4">
          <TableComponent
            headers={[
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
            fetchWarehouses()
            setDeleteModalOpen(false);
          }}
        />
        <div className="flex justify-center items-center w-full bottom-0 position-absolute mb-4">
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
