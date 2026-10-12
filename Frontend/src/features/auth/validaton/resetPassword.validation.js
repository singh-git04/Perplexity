const resetPasswordValidation = function validateForm({ password, confirmPassword }) {
  const newErrors = {};
  const trimmedPassword = (password || '').trim();
  const trimmedConfirmPassword = (confirmPassword || '').trim();

  // Password validation matching backend rules
  if (!trimmedPassword) {
    newErrors.password = 'Password is required';
  } else if (trimmedPassword.length < 6) {
    newErrors.password = 'Password must be at least 6 characters long';
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(trimmedPassword)) {
    newErrors.password = 'Password must contain at least one letter and one number';
  }

  // Confirm password validation
  if (!trimmedConfirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
  } else if (trimmedPassword !== trimmedConfirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  return newErrors;
};

export default resetPasswordValidation;
