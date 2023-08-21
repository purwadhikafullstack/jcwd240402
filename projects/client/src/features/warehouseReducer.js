const initialState = {
  cities: [],
  warehouses: [],
  error: null,
};

export const warehouseReducer = (state = initialState, action) => {
  switch (action.type) {
    case "WAREHOUSE_LOAD_CITIES_SUCCESS":
      return {...state,cities: action.payload,};
      case "WAREHOUSE_LOAD_CITIES_FAIL":
      return {...state,error: action.error,};
    case "WAREHOUSE_LOAD_WAREHOUSES_SUCCESS":
      return {...state,warehouses: action.payload,};
    case "WAREHOUSE_LOAD_WAREHOUSES_FAIL":
      return {...state,error: action.error,};
    default:
      return state;
  }
};
