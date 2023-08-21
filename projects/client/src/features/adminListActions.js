import axios from "../api/axios";

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
      dispatch({ type: "ADMIN_LOAD_ADMINS_FAIL", error: error.message,
     });
    }
  };
