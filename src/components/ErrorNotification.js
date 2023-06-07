import React from "react";
import "./ErrorNotification.css";
import { useSelector } from "react-redux";

const ErrorNotification = () => {
  const error = useSelector((state) => state.error);

  return (
    <div className="error-notification">
      <p>{error}</p>
    </div>
  );
};

export default ErrorNotification;
