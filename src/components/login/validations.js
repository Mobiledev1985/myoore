const validations = (_values, screenName) => {
  const errors = {};
  if (_values !== null && screenName === 'Login') {
    if (
      _values.mobileEmailAddress === '' ||
      _values.mobileEmailAddress === undefined ||
      _values.mobileEmailAddress === null
    ) {
      errors.mobileEmailAddress = 'Please enter mobile number / email address';
      return errors;
    } else {
      errors.mobileEmailAddress = '';
    }
  } else if (_values !== null && screenName === 'LoginOTP') {
    if (
      _values.mobileNumber === '' ||
      _values.mobileNumber === undefined ||
      _values.mobileNumber === null
    ) {
      errors.mobileNumber = 'Please enter Mobile Number';
      return errors;
    } else {
      errors.mobileNumber = '';
    }
  } else if (_values !== null && screenName === 'LoginPassword') {
    if (
      _values.emailAddress === '' ||
      _values.password === undefined ||
      _values.emailAddress === null
    ) {
      errors.emailAddress = 'Please enter email address';
      return errors;
    } else if (
      _values.password === '' ||
      _values.password === undefined ||
      _values.password === null
    ) {
      errors.password = 'Please enter password';
      return errors;
    } else {
      errors.emailAddress = '';
      errors.password = '';
    }
  }
  return errors;
};

export default validations;
