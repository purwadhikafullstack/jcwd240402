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
  console.log("Refreshing with parameters:", {
    selectedCity,
    selectedWarehouse,
    adminName,
    newPage,
  }); // Log the parameters

  if (selectedCity && selectedWarehouse) {
    const url = `http://localhost:8000/api/admin/?searchName=${adminName}&warehouseId=${selectedWarehouse.value}&page=${newPage}`;
    console.log("Making API call to:", url); // Log the URL

    axios.get(url).then((res) => {
      console.log("Received response from API:", res.data); // Log the response data

      const newAdmins = res.data.admins;
        console.log("Updating admin list with:", newAdmins); // Log the new admins
        setAdmins(newAdmins);
        setPagination({
          currentPage: res.data.pagination.page,
          totalPages: res.data.pagination.totalPages,
        });
      
    });
  }
};
