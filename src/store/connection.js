import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAccessToken } from "../store/api";
import { setError } from "./error";

const accessToken = await getAccessToken();

export const createConnection = createAsyncThunk(
  "connection/createConnection",
  async (user, { dispatch }) => {
    try {
      const connectionData = {
        loginId: "gavinBelson",
        password: "hooli2016",
        institution: {
          id: "AU00000",
        },
      };

      const response = await axios.post(
        `https://au-api.basiq.io/users/${user.id}/connections`,
        connectionData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating connection:", error);
      dispatch(setError(error.message));
      throw error;
    }
  }
);

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    loading: false,
    error: null,
    connectionId: null,
    //type: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createConnection.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createConnection.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.connectionId = action.payload.id;
      //state.type = action.payload.type;
    });
    builder.addCase(createConnection.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.connectionId = null;
      //state.type = null;
    });
  },
});

export default connectionSlice.reducer;
