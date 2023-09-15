import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const stockProductSlice = createSlice({
  name: "stockProduct",
  initialState,
  reducers: {
    stockProduct: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { stockProduct } = stockProductSlice.actions;

export default stockProductSlice.reducer;
