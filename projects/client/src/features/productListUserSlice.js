import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const productListUserSlice = createSlice({
  name: "userProducts",
  initialState,
  reducers: {
    productsUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { productsUser } = productListUserSlice.actions;

export default productListUserSlice.reducer;
