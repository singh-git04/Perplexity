const forgotPasswordValidation = function validateForm({ email }) {
  const newErrors = {};
  const trimmedEmail = (email || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail) {
    newErrors.email = 'Email is required';
  } else if (!emailRegex.test(trimmedEmail)) {
    newErrors.email = 'Please enter a valid email address';
  }

  return newErrors;
};

export default forgotPasswordValidation;
