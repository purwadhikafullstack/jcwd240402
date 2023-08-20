import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const userAddressSlice = createSlice({
  name: "userAddress",
  initialState,
  reducers: {
    addressUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addressUser } = userAddressSlice.actions;

export default userAddressSlice.reducer;
