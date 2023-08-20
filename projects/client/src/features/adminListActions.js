import axios from "../api/axios";

export const loadCitiesAction = (inputValue) => async (dispatch) => {
  try {
    const response = await axios.get(
      `/admin/city/?searchName=${inputValue}&page=1`
    );
    // console.log("Cities API Response:", response.data);
    dispatch({
      type: "ADMIN_LOAD_CITIES_SUCCESS",
      payload: response.data.cities,
    });
    return response.data.cities;
  } catch (error) {
    console.error("Error loading cities:", error);
    dispatch({ type: "ADMIN_LOAD_CITIES_FAIL", error });
  }
};

// export const loadWarehousesAction =
//   (inputValue, cityId) => async (dispatch) => {
//     if (!cityId) return;
//     try {
//       const response = await axios.get(
//         `/warehouse/warehouse-list?searchName=${inputValue}&cityId=${cityId}`
//       );
//       console.log("Warehouses API Response:", response.data);
//       dispatch({
//         type: "ADMIN_LOAD_WAREHOUSES_SUCCESS",
//         payload: response.data.warehouses,
//       });
//     } catch (error) {
//       console.error("Error loading warehouses:", error);
//       dispatch({ type: "ADMIN_LOAD_WAREHOUSES_FAIL", error });
//     }
//   };

export const loadWarehousesAction = (inputValue) => async (dispatch) => {
  try {
    const response = await axios.get(
      `/warehouse/warehouse-list?searchName=${inputValue}`
    );
    console.log("Warehouses API Response:", response.data);
    dispatch({
      type: "ADMIN_LOAD_WAREHOUSES_SUCCESS",
      payload: response.data.warehouses,
    });
    return response.data.warehouses;
  } catch (error) {
    console.error("Error loading warehouses:", error);
    dispatch({ type: "ADMIN_LOAD_WAREHOUSES_FAIL", error });
  }
};

// export const loadAdminsAction =
//   (searchName, warehouseId, page = 1) =>
//   async (dispatch) => {
//     try {
//       const response = await axios.get(
//         `/admin/?searchName=${searchName}&warehouseId=${warehouseId}&page=${page}`
//       );
//       console.log("Admins API Response:", response.data);
//       dispatch({
//         type: "ADMIN_LOAD_ADMINS_SUCCESS",
//         payload: response.data.admins,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error loading admins:", error);
//       dispatch({ type: "ADMIN_LOAD_ADMINS_FAIL", error });
//     }
//   };
export const loadAdminsAction =
  (searchName, warehouseId, page = 1) =>
  async (dispatch) => {
    try {
      let url = "/admin/?page=" + page;
      if (searchName) {
        url += "&searchName=" + searchName;
      }
      if (warehouseId) {
        url += "&warehouseId=" + warehouseId;
      }
      const response = await axios.get(url);
      console.log("Admins API Response:", response.data);
      dispatch({
        type: "ADMIN_LOAD_ADMINS_SUCCESS",
        payload: response.data.admins,
      });
      return response.data;
    } catch (error) {
      console.error("Error loading admins:", error);
      dispatch({ type: "ADMIN_LOAD_ADMINS_FAIL", error });
    }
  };
