import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAccessToken } from "../store/api";
import { setError } from "./error";
const initialState = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  type: "",
};
const accessToken = await getAccessToken();

export const createUser = createAsyncThunk(
  "user/createUser",
  async (user, { dispatch }) => {
    try {
      const response = await axios.post("https://au-api.basiq.io/users", user, {
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state, action) => {
      const userData = action.payload;
      state.firstName = userData.firstName;
      state.lastName = userData.lastName;
      state.email = userData.email;
      state.mobile = userData.mobile;
      state.error = null;
      state.type = userData.type;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.error = action.error.message;
      state.type = "user";
    });
  },
});

export default userSlice.reducer;
