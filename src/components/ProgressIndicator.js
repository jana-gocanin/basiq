// import React from "react";
// import "./ProgressIndicator.css";
// import { useSelector } from "react-redux";

// const ProgressIndicator = ({ step }) => {
//   //const steps = ["Verification", "Fetching Data", "Processing", "Completed"];
//   const currentStep = useSelector((state) => state.progress?.currentStep);
//   const currentStatus = useSelector((state) => state.progress?.currentStatus);

//   return (
//     <div className="progress-indicator">
//       {/* {steps.map((s, index) => (
//         <div key={index} className={`step ${index === step ? "active" : ""}`}>
//           {s}
//         </div>
//       ))} */}
//       <div>Current Step: {currentStep}</div>
//       <div>Current Status: {currentStatus}</div>
//     </div>
//   );
// };

// export default ProgressIndicator;

import React from "react";
import { useSelector } from "react-redux";
import "./ProgressIndicator.css";

const ProgressIndicator = () => {
  const currentStep = useSelector((state) => state.transaction.currentStep);

  const steps = ["waiting for a user", "verifying", "fetching data", "done"];

  const getStepIndex = () => {
    return steps.indexOf(currentStep);
  };

  return (
    <div className="progress-indicator">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index <= getStepIndex() ? "active" : ""}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
