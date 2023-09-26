import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../features/userDataSlice";
import adminDataReducer from "../features/adminDataSlice";
import userAddressReducer from "../features/userAddressSlice";
import productListUserReducer from "../features/productListUserSlice";
import counterReducer from "../features/counterSlice";
import productReducer from "../features/productReducer";
import cartReducer from "../features/cartSlice";
import warehouseListReducer from "../features/warehouseListSlice";
import wishlistReducer from "../features/wishlistDataSlice";
import stockProductReducer from "../features/stockProductSlice";

export const store = configureStore({
  reducer: {
    profiler: userDataReducer,
    profilerAdmin: adminDataReducer,
    addresser: userAddressReducer,
    producter: productListUserReducer,
    counter: counterReducer,
    product: productReducer,
    carter: cartReducer,
    warehouse: warehouseListReducer,
    wishlister: wishlistReducer,
    stocker: stockProductReducer,
  },
});
