import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAccessToken } from "../store/api";
import { setError } from "./error";
import { BASE_URL } from "../store/api";

const accessToken = await getAccessToken();

export const createConnection = createAsyncThunk(
  "connection/createConnection",
  async (user, { dispatch, rejectWithValue }) => {
    try {
      const connectionData = {
        loginId: "gavinBelson",
        password: "hooli2016",
        institution: {
          id: "AU00000",
        },
      };

      const response = await axios.post(
        `${BASE_URL}/users/${user.id}/connections`,
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
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshConnection = createAsyncThunk(
  "connection/refreshConnection",
  async ({ connectionId, user }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/${user.id}/connections/${connectionId}/refresh`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing connection:", error);
      dispatch(setError(error.message));
      return rejectWithValue(error.response.data);
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
  reducers: {
    setConnectionId: (state, action) => {
      state.connectionId = action.payload;
    },
  },
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
    builder.addCase(refreshConnection.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(refreshConnection.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.connectionId = action.payload.id;
    });
    builder.addCase(refreshConnection.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export const setConnectionId = connectionSlice.actions.setConnectionId;
export default connectionSlice.reducer;
