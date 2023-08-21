import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../features/userDataSlice";
import userAddressReducer from "../features/userAddressSlice";
import productListUserReducer from "../features/productListUserSlice";

export const store = configureStore({
  reducer: {
    profiler: userDataReducer,
    addresser: userAddressReducer,
    producter: productListUserReducer,
  },
});
