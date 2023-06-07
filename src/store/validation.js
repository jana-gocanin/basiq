import { setError, clearError } from "../store/error";

const validateMobile = (mobile) => {
  const mobileRegex = /^\+\d{9,12}$/;

  const isValid = mobileRegex.test(mobile);

  return isValid;
  //   if (isValid) {
  //     return (dispatch) => {
  //       dispatch(clearError());
  //     };
  //   } else {
  //     return (dispatch) => {
  //       dispatch(
  //         setError(
  //           "Invalid mobile number. Please try again. Number must start with a + and have 6 or 7 digits after the country code."
  //         )
  //       );
  //     };
  //   }
};
export default validateMobile;
