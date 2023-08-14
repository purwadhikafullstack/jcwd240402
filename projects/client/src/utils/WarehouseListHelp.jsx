import axios from "axios";

export const refreshWarehouseList = (
  searchName,
  cityId,
  page,
  setWarehouses,
  setTotalPages
) => {
  const url = `http://localhost:8000/api/warehouse/warehouse-list?searchName=${searchName}&cityId=${cityId}&page=${page}&pageSize=10`;
  axios
    .get(url)
    .then((res) => {
      setWarehouses(res.data.warehouses);
      setTotalPages(res.data.pagination.totalPages);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
};

export const updateWarehouse = (
  field,
  value,
  selectedWarehouse,
  setWarehouses,
  setEditModalOpen,
  setWarehouseModalOpen
) => {
  let updatedData;
  if (field === "Warehouse Name") {
    updatedData = { warehouse_name: value };
  } else if (field === "Warehouse Address") {
    updatedData = { address_warehouse: value };
  } else if (field === "Warehouse Contact") {
    updatedData = { warehouse_contact: value };
  } else if (field === "City ID") {
    updatedData = { city_id: value };
  } else {
    updatedData = { [field]: value };
  }
  const url = `http://localhost:8000/api/warehouse/${selectedWarehouse.id}`;
  axios
    .patch(url, updatedData)
    .then(() => {
      refreshWarehouseList(selectedWarehouse.id, setWarehouses);
      setEditModalOpen(false);
      setWarehouseModalOpen(false);
    })
    .catch((error) => {
      console.error("An error occurred while updating:", error);
    });
};

export const loadCities = (inputValue, callback) => {
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
