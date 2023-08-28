const initialState = {
    productDetails: {},
  };
  
  const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case "UPDATE_PRODUCT_DETAILS":
        return {
          ...state,
          productDetails: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default productReducer;