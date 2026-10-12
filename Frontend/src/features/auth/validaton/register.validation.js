const registerValidation = function validateForm({username,email,password}) {
    const newErrors = {}
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Username validation matching backend registerValidator
    if (!trimmedUsername) {
      newErrors.username = 'Username is required'
    } else if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      newErrors.username = 'Username must be between 3 and 20 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }

    // Email validation matching backend registerValidator
    if (!trimmedEmail) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation matching backend registerValidator
    if (!trimmedPassword) {
      newErrors.password = 'Password is required'
    } else if (trimmedPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(trimmedPassword)) {
      newErrors.password = 'Password must contain at least one letter and one number'
    }

    return newErrors
  }

export default registerValidation