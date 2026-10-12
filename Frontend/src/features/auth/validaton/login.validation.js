const loginValidation = function validateForm({email,password}) {
    const newErrors = {}
    const trimmedEmail = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Email validation
    if (!trimmedEmail) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    }

    return newErrors
  }

export default loginValidation