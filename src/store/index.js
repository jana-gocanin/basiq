import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import errorReducer from "./error";
import connectionReducer from "./connection";
import transactionReducer from "./transaction";

const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    connection: connectionReducer,
    transaction: transactionReducer,
  },
});

export default store;
