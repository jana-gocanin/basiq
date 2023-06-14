const validateMobile = (mobile) => {
  const mobileRegex = /^\+\d{9,12}$/;

  const isValid = mobileRegex.test(mobile);

  return isValid;
};
export default validateMobile;
