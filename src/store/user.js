import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAccessToken } from "../store/api";
import { setError } from "./error";
import { BASE_URL } from "../store/api";
const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  createdUser: null,
};
const accessToken = await getAccessToken();

export const createUser = createAsyncThunk(
  "user/createUser",
  async (user, { dispatch }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, user, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      dispatch(setError(error.message));
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCreatedUser: (state, action) => {
      state.createdUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state, action) => {
      const userData = action.payload;
      state.firstName = userData.firstName;
      state.lastName = userData.lastName;
      state.email = userData.email;
      state.mobile = userData.mobile;
      state.error = null;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});
export const { setCreatedUser } = userSlice.actions.setCreatedUser;
export default userSlice.reducer;
