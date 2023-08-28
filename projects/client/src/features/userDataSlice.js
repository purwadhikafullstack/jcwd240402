import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    profileUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { profileUser } = userDataSlice.actions;

export default userDataSlice.reducer;
