import { createSlice } from "@reduxjs/toolkit";


const initialState = null;

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action) => action.payload,
    clearError: () => null,
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
