import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const wishlistDataSlice = createSlice({
  name: "wishlistUser",
  initialState,
  reducers: {
    wishlistUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { wishlistUser } = wishlistDataSlice.actions;

export default wishlistDataSlice.reducer;
