import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";
import { getAccessToken } from "../store/api";

const accessToken = await getAccessToken();
let currentStep = null;

//  export const getTransactions = createAsyncThunk(
//    "transaction/getTransactions",
//    async (user) => {
//      try {
//        const response = await axios.get(
//          `https://au-api.basiq.io/users/${user.id}/transactions`,
//          {
//            headers: {
//              Authorization: `Bearer ${accessToken}`,
//            },
//          }
//        );
//        return response.data;
//      } catch (error) {
//        console.error("Error getting transactions:", error);
//        throw error;
//      }
//    }
//  );

// export const fetchTransactions = createAsyncThunk(
//   "transaction/fetchTransactions",
//   async (user) => {
//     try {
//       const transactions = [];

//       let nextLink = `https://au-api.basiq.io/users/${user?.id}/transactions`;

//       while (nextLink) {
//         const response = await axios.get(nextLink, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         transactions.push(...response.data.data);
//         nextLink = response?.data?.links?.next;
//       }

//       return transactions;
//     } catch (error) {
//       console.error("Error getting transactions:", error);
//       throw error;
//     }
//   }
// );

export const getTransactions = createAsyncThunk(
  "transaction/getTransactions",
  async ({ user, connection }) => {
    try {
      const jobId = connection.payload.id;

      const checkJobStatus = async () => {
        const jobStatusResponse = await axios.get(
          `https://au-api.basiq.io/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const jobStatus = jobStatusResponse.data;

        if (jobStatus.steps.every((step) => step.status === "success")) {
          // Svi koraci su uspešno dovršeni, dohvati transakcije
          //const transactions = await fetchTransactions(user);

          const transactions = [];
          try {
            let nextLink = `https://au-api.basiq.io/users/${user?.id}/transactions`;

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
          currentStep = jobStatus.steps.find(
            (step) => step.status === "in-progress"
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return checkJobStatus();
        }
      };
      const transactionResult = await checkJobStatus();
      return transactionResult;

      // Pokretanje provere statusa posla
      //   const transactionss = await checkJobStatus();
      //   const { transactions, steps } = transactionss;
      //   return { transactions, steps };

      //const steps = transactions.payload.steps; // Pristup steps svojstvu
    } catch (error) {
      console.error("Error getting transactions:", error);
      throw error;
    }
  }
);

// export const getTransactions = createAsyncThunk(
//   "transaction/getTransactions",
//   async ({ user, connection }) => {
//     try {
//       const transactions = [];

//       const konekcija = await axios.post(
//         `https://au-api.basiq.io/users/${user.id}/connections/${connection.id}`,
//         null,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             //"Content-Type": "application/json",
//           },
//         }
//       );

//       let nextLink = konekcija.data.links.transactions;

//       while (nextLink) {
//         const response = await axios.get(nextLink, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         transactions.push(...response.data.data);
//         nextLink = response?.data?.links?.next;
//       }

//       return transactions;
//     } catch (error) {
//       console.error("Error getting transactions:", error);
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
      //state.currentStep = currentStep?.title;
      //state.currentStatus = currentStep?.status;
    });
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.transactions = action.payload.transactions; //ovde uvek paziti jel payload.data ili payload
      //state.currentStep =
      //action.payload?.steps[action.payload.steps?.length - 1].title;
      //state.currentStatus =
      //action.payload?.steps[action.payload.steps?.length - 1].status;
    });
    builder.addCase(getTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.transactions = null;
      //state.currentStep =
      //action.payload?.steps[action.payload.steps?.length - 1].title;
      //state.currentStatus =
      //action.payload?.steps[action.payload.steps?.length - 1].status;
    });
  },
});

export const { setCurrentStep } = transactionSlice.actions;

export default transactionSlice.reducer;
