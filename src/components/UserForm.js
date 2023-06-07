import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/user";
import "./UserForm.css";
import axios from "axios";

const UserForm = () => {
  const createUserConnection = async () => {
    const endpoint = "https://au-api.basiq.io/users/ea3a81/connections";
    const accessToken =
      "OTY2ZGNlOTYtYTVhYS00MTRhLWE1OGQtMDU1NTkzM2E2ODM3OjUyM2UyZTc1LTI3YmItNGFkZC1iYzI5LWU5MzdkNmI5MTc2Nw==";

    const credentials = {
      loginId: "gavinBelson",
      password: "hooli2016",
      institution: {
        id: "AU00000",
      },
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(endpoint, credentials, { headers });
      console.log("User connection created:", response.data);
      // Perform any additional actions after successful connection creation
    } catch (error) {
      console.error("Error creating user connection:", error);
      // Handle any error scenarios
    }
  };

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateUser({ [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserConnection();
    //  pozvati akciju za integraciju s API-jem i obraditi podatke
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>User Form</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;
