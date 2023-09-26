import axios from "../api/axios";

export const loadProvinces = async (inputValue) => {
  try {
    const response = await axios.get(
      `/admin/province/?searchName=${inputValue}&page=1`
    );
    return response.data.provinces.map((province) => ({
      value: province.id,
      label: province.name,
    }));
  } catch (error) {
    console.error("Error loading provinces:", error);
    return [];
  }
};

export const loadCities = async (inputValue = "", provinceId) => {
  try {
    const response = await axios.get(
      `/admin/city/?searchName=${inputValue}&page=1&provinceId=${provinceId}`
    );
    const cities = response.data.cities.map((city) => ({
      value: city.id,
      label: city.name,
    }));
    return cities;
  } catch (error) {
    console.error("Error loading cities:", error);
    return [];
  }
};

export const fetchWarehouseData = async (
  warehouseName,
  setValues,
  setCurrentImage,
  setInitialWarehouseData,
  setSelectedCity,
  setSelectedProvince,
  setProvinceChanged,
  setLoading
) => {
  try {
    const response = await axios.get(`/warehouse/${warehouseName}`);
    if (response.data && response.data.warehouse) {
      setCurrentImage(response.data?.warehouse?.warehouse_img);
      const { warehouse } = response.data;
      const initialData = {
        id: warehouse.id,
        warehouse_name: warehouse.warehouse_name,
        address_warehouse: warehouse.address_warehouse,
        warehouse_contact: warehouse.warehouse_contact,
        city_id: warehouse.city_id,
        province_id: warehouse.province_id,
      };
      setValues(initialData);
      setInitialWarehouseData(initialData);
      setSelectedCity({
        value: warehouse.city_id,
        label: warehouse.City.name,
      });
      setSelectedProvince({
        value: warehouse.province_id,
        label: warehouse.City.Province.name,
      });
      setProvinceChanged(true);
      setLoading(false);
    }
  } catch (error) {
    console.error("Error fetching warehouse data", error);
    setLoading(false);
  }
};
