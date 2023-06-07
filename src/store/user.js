import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAccessToken } from "../store/api";

const initialState = {
  username: "",
  password: "",
  spendingData: [],
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  type: "",
};
const accessToken = await getAccessToken();

export const createUser = createAsyncThunk("user/createUser", async (user) => {
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
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state = { ...state, ...action.payload };
    },
    setSpendingData: (state, action) => {
      state.spendingData = action.payload;
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
      state.type = userData.type;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.error = action.error.message;
      state.type = "user";
    });
  },
});

// const initialState = {
//   username: "",
//   password: "",
//   spendingData: [], // Dodajemo polje za podatke o potrošnji
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     updateUser: (state, action) => {
//       return {
//         ...state,
//         ...action.payload,
//       };
//     },
//     setSpendingData: (state, action) => {
//       state.spendingData = action.payload;
//     },
//   },
// });

export const { updateUser, setSpendingData } = userSlice.actions;
export default userSlice.reducer;
