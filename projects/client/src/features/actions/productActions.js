import axios from "../../api/axios";

export const fetchProductDetails = (productName) => async (dispatch) => {
  try {
    const response = await axios.get(`/admin/single-product`, {
      params: { name: productName },
    });
    dispatch({ type: "UPDATE_PRODUCT_DETAILS", payload: response.data });
  } catch (error) {
    console.error("Error fetching the product details:", error);
  }
};

