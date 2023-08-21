import axios from "../api/axios";

export const loadCitiesAction = (inputValue) => async (dispatch) => {
  try {
    const response = await axios.get(
      `/admin/city/?searchName=${inputValue}&page=1`
    );
    // console.log("Cities API Response:", response.data);
    dispatch({
      type: "WAREHOUSE_LOAD_CITIES_SUCCESS",
      payload: response.data.cities,
    });
    return response.data.cities;
  } catch (error) {
    console.error("Error loading cities:", error);
    dispatch({
      type: "WAREHOUSE_LOAD_CITIES_FAIL",error,});
  }
};

export const loadWarehousesAction =
  (warehouseName = "", cityId, page = 1) =>
  async (dispatch) => {
    try {
      let url = `/warehouse/warehouse-list?page=${page}`;
      
      if (warehouseName) {
        url += `&searchName=${warehouseName}`;
      }
      if (cityId) {
        url += `&cityId=${cityId}`;
      }

      const response = await axios.get(url);
      console.log("Warehouses API Response:", response.data);
      dispatch({
        type: "WAREHOUSE_LOAD_WAREHOUSES_SUCCESS",
        payload: response.data.warehouses,
      });
      return response.data.warehouses;
    } catch (error) {
      console.error("Error loading warehouses:", error);
      dispatch({type: "WAREHOUSE_LOAD_WAREHOUSES_ERROR",error: error.message,
      });
    }
  };

