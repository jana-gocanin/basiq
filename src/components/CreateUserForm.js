import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../store/user";
import "./CreateUserForm.css";
import ErrorNotification from "./ErrorNotification";
import validateMobile from "../store/validation";
import { setError, clearError } from "../store/error";
import { createConnection } from "../store/connection";
import { getTransactions } from "../store/transaction";
import { setCurrentStep } from "../store/transaction";
import { useEffect } from "react";

const CreateUserForm = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error);
  useEffect(() => {
    // Podesavanje currentStep prilikom pravljenja komponente
    dispatch(setCurrentStep("waiting for a user"));
  }, [dispatch]);

  const handleChange = () => {
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email: e.target.email.value,
      mobile: e.target.mobile.value,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
    };

    const valid = validateMobile(user.mobile);
    if (valid) {
      //kreiram korisnika
      dispatch(setCurrentStep("verifying"));
      const createdUser = await dispatch(createUser(user));

      //kreiram konekciju za korisnika

      const createdConnection = await dispatch(
        createConnection(createdUser.payload)
      );
      dispatch(setCurrentStep("fetching data"));
      await dispatch(
        getTransactions({
          user: createdUser.payload,
          connection: createdConnection,
        })
      ); //prosledi connecton
    } else {
      dispatch(
        setError(
          "Invalid mobile number Please try again. Number must start with a + and have 6 or 7 digits after the country code."
        )
      );
    }
    dispatch(setCurrentStep("done"));
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
      <button type="submit">Create</button>
      {error && <ErrorNotification />}
    </form>
  );
};

export default CreateUserForm;
