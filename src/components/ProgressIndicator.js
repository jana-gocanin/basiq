import React from "react";
import { useSelector } from "react-redux";
import "./ProgressIndicator.css";

const ProgressIndicator = () => {
  const currentStep = useSelector((state) => state.transaction.currentStep);
  const error = useSelector((state) => state.error);

  const steps = ["waiting for a user", "verifying", "fetching data", "done"];

  const getStepIndex = () => {
    return steps.indexOf(currentStep);
  };
  const isStepError = (step) => {
    return error;
  };

  return (
    <div className="progress-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${isStepError(step) ? "error" : ""} ${
            index <= getStepIndex() ? "active" : ""
          }`}
          data-testid="step"
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
