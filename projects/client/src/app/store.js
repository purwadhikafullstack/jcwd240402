import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counterSlice";
import userDataReducer from "../features/userDataSlice";
import userAddressReducer from "../features/userAddressSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    profiler: userDataReducer,
    addresser: userAddressReducer,
  },
});
