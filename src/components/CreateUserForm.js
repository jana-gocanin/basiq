import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../store/user";
import "./CreateUserForm.css";
import ErrorNotification from "./ErrorNotification";
import validateMobile from "../store/validation";
import { setError } from "../store/error";
import { createConnection } from "../store/connection";
import { getTransactions } from "../store/transaction";
import { setCurrentStep } from "../store/transaction";
import { useEffect } from "react";

const CreateUserForm = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error);
  const currentStep = useSelector((state) => state.transaction.currentStep);
  useEffect(() => {
    // Podešavanje currentStep prilikom montiranja komponente
    dispatch(setCurrentStep("waiting for a user"));
  }, [dispatch]);

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
      //   if (createdUser.payload) {
      //     const connectionUser = {
      //       id: createdUser.payload.id,
      //     };

      const createdConnection = await dispatch(
        createConnection(createdUser.payload)
      );
      dispatch(setCurrentStep("fetching data"));
      //}
      //console.log(createdUser.payload);
      //await dispatch(connection(createdUser.payload.id));
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
    //dispatch(createUser(user));
  };

  return (
    <form className="create-user-form" onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <div>
        <label>Email:</label>
        <input type="email" name="email" required />
      </div>
      <div>
        <label>Mobile:</label>
        <input type="tel" name="mobile" required />
      </div>
      <div>
        <label>First Name:</label>
        <input type="text" name="firstName" />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" name="lastName" />
      </div>
      <button type="submit">Create</button>
      {/* <p>Current Step: {currentStep}</p> */}
      {error && <ErrorNotification />}
    </form>
  );
};

export default CreateUserForm;
