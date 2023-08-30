import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const adminDataSlice = createSlice({
  name: "adminData",
  initialState,
  reducers: {
    profileAdmin: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { profileAdmin } = adminDataSlice.actions;

export default adminDataSlice.reducer;
