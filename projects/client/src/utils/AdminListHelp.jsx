import axios from "axios";

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

export const loadWarehouses = (inputValue, selectedCity, callback) => {
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

export const refreshAdminList = (
  selectedCity,
  selectedWarehouse,
  adminName,
  newPage,
  admins,
  setAdmins,
  setPagination
) => {
  if (selectedCity && selectedWarehouse) {
    axios
      .get(
        `http://localhost:8000/api/admin/?searchName=${adminName}&warehouseId=${selectedWarehouse.value}&page=${newPage}`
      )
      .then((res) => {
        const newAdmins = res.data.admins;
        if (
          !admins.length ||
          admins.some((admin, index) => admin.id !== newAdmins[index]?.id)
        ) {
          setAdmins(newAdmins);
          setPagination({
            currentPage: res.data.pagination.page,
            totalPages: res.data.pagination.totalPages,
          });
        }
      });
  }
};
