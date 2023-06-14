import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAccessToken } from "../store/api";
import { setError } from "./error";
import { BASE_URL } from "../store/api";

const accessToken = await getAccessToken();

const checkJobStatus = async (jobId, user) => {
  const jobStatusResponse = await axios.get(`${BASE_URL}/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const jobStatus = jobStatusResponse.data;

  if (jobStatus.steps.every((step) => step.status === "success")) {
    // Svi koraci su uspešno dovršeni, uzmi transakcije

    const transactions = [];
    try {
      let nextLink = `${BASE_URL}/users/${user?.id}/transactions`;

      while (nextLink) {
        const response = await axios.get(nextLink, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        transactions.push(...response.data.data);
        nextLink = response?.data?.links?.next;
      }
    } catch (error) {
      console.error("Error getting transactions:", error);
      throw error;
    }

    return {
      transactions: transactions,
      steps: jobStatus.steps,
    };
  } else if (jobStatus.steps.some((step) => step.status === "failed")) {
    // Postoji neuspešan korak u poslu
    throw new Error("Job execution failed");
  } else {
    // I dalje je u toku, proveri ponovno nakon određenog vremena

    await new Promise((resolve) => setTimeout(resolve, 2000)); //resolve ce se desiti nakon 2 sekunde
    return checkJobStatus(jobId, user);
  }
};

export const getTransactions = createAsyncThunk(
  "transaction/getTransactions",
  async ({ user, connection }, { dispatch }) => {
    try {
      const jobId = connection.payload ? connection.payload.id : connection.id;
      const transactionResult = await checkJobStatus(jobId, user);
      return transactionResult;
    } catch (error) {
      console.error("Error getting transactions:", error);
      dispatch(setError(error.message));
      throw error;
    }
  }
);

// export const getTransactions = createAsyncThunk(
//   "transaction/getTransactions",
//   async ({ user, connection }, { dispatch }) => {
//     try {
//       const jobId = connection.payload.id;

//       const checkJobStatus = async () => {
//         const jobStatusResponse = await axios.get(`${BASE_URL}/jobs/${jobId}`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         const jobStatus = jobStatusResponse.data;

//         if (jobStatus.steps.every((step) => step.status === "success")) {
//           // Svi koraci su uspešno dovršeni, uzmi transakcije

//           const transactions = [];
//           try {
//             let nextLink = ` ${BASE_URL}/users/${user?.id}/transactions`;

//             while (nextLink) {
//               const response = await axios.get(nextLink, {
//                 headers: {
//                   Authorization: `Bearer ${accessToken}`,
//                 },
//               });

//               transactions.push(...response.data.data);
//               nextLink = response?.data?.links?.next;
//             }
//           } catch (error) {
//             console.error("Error getting transactions:", error);
//             dispatch(setError(error.message));
//             throw error;
//           }

//           return {
//             transactions: transactions,
//             steps: jobStatus.steps,
//           };
//         } else if (jobStatus.steps.some((step) => step.status === "failed")) {
//           // Postoji neuspešan korak u poslu
//           throw new Error("Job execution failed");
//         } else {
//           // I dalje je u toku, proveri ponovno nakon određenog vremena

//           await new Promise((resolve) => setTimeout(resolve, 2000)); //resolve ce se desiti nakon 2 sekunde
//           return checkJobStatus();
//         }
//       };
//       const transactionResult = await checkJobStatus();
//       return transactionResult;
//     } catch (error) {
//       console.error("Error getting transactions:", error);
//       dispatch(setError(error.message));
//       throw error;
//     }
//   }
// );

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    loading: false,
    error: null,
    transactions: null,
    currentStep: null,
    currentStatus: null,
  },
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.transactions = null;
    });
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.transactions = action.payload.transactions; //ovde uvek paziti jel payload.data ili payload
    });
    builder.addCase(getTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.transactions = null;
    });
  },
});

export const { setCurrentStep } = transactionSlice.actions;

export default transactionSlice.reducer;
