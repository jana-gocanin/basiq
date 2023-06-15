import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../store/user";
import "./CreateUserForm.css";
import ErrorNotification from "./ErrorNotification";
import validateMobile from "../store/validation";
import { setError, clearError } from "../store/error";
import { createConnection, refreshConnection } from "../store/connection";
import { getTransactions } from "../store/transaction";
import { setCurrentStep } from "../store/transaction";
import { useEffect, useState } from "react";

const CreateUserForm = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error);
  const step = useSelector((state) => state.transaction.currentStep);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const [createdUser, setCreatedUser] = useState(null);

  useEffect(() => {
    dispatch(setCurrentStep("waiting for a user"));
  }, [dispatch]);

  const handleChange = () => {
    dispatch(clearError());
    dispatch(setCurrentStep("waiting for a user"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email: e.target.email.value,
      mobile: e.target.mobile.value,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
    };
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      (user.email === "" && user.mobile === "")
    ) {
      dispatch(setError("Please fill out required fields."));
      return;
    }

    const valid = validateMobile(user.mobile);
    if (valid) {
      dispatch(setCurrentStep("verifying"));
      const createdUser = await dispatch(createUser(user));
      const createdConnection = await dispatch(
        createConnection(createdUser.payload)
      );
      dispatch(setCurrentStep("fetching data"));
      const transactionResult = await dispatch(
        getTransactions({
          user: createdUser.payload,
          connection: createdConnection,
        })
      );
      const connectionId = transactionResult.payload.steps[0].result.url
        .split("/")
        .pop();

      setCreatedUser(createdUser);
      setConnectionId(connectionId);
    } else {
      dispatch(
        setError(
          "Invalid mobile number. Please try again. Number must start with a + and have 6 or 7 digits after the country code."
        )
      );
    }
    dispatch(setCurrentStep("done"));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    dispatch(setCurrentStep("fetching data"));

    const refreshedConnection = await dispatch(
      refreshConnection({
        connectionId: connectionId,
        user: createdUser.payload,
      })
    );

    const newConnection = refreshedConnection.payload;

    const transactionResult = await dispatch(
      getTransactions({
        user: createdUser.payload,
        connection: newConnection,
      })
    );
    dispatch(setCurrentStep("done"));

    const updatedConnectionId = transactionResult.payload.steps[0].result.url
      .split("/")
      .pop();

    setConnectionId(updatedConnectionId);
    setIsRefreshing(false);
  };

  return (
    <form className="create-user-form" onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <div>
        <label>Email:</label>
        <input type="email" name="email" required onChange={handleChange} />
      </div>
      <div>
        <label>Mobile:</label>
        <input type="tel" name="mobile" required onChange={handleChange} />
      </div>
      <div>
        <label>First Name:</label>
        <input type="text" name="firstName" onChange={handleChange} />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" name="lastName" onChange={handleChange} />
      </div>
      <button
        type="submit"
        disabled={step === "verifying" || step === "fetching data"}
      >
        Create
      </button>
      <button
        id="refresh-button"
        type="button"
        onClick={handleRefresh}
        disabled={!connectionId || isRefreshing}
      >
        Refresh
      </button>
      {error && <ErrorNotification />}
    </form>
  );
};

export default CreateUserForm;
