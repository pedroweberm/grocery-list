export const usernameValidator = (username: string) => {
  if (username.length >= 2) {
    return true
  }

  return false
}

export const phoneNumberValidator = (phoneNumber: string) => {
  if (phoneNumber.length >= 8) {
    return true
  }

  return false
}

export const emailValidator = (email: string) => {
  if (email.length >= 2 && email.includes('@') && email.includes('.') && email.lastIndexOf('.') - email.indexOf('@') > 1) {
    return true
  }

  return false
}

export const nameValidator = (name: string) => {
  if (name.length >= 2) {
    return true
  }

  return false
}

export const passwordValidator = (password: string) => {
  if (password.length >= 5) {
    return true
  }

  return false
}

export const validationCodeValidator = (code: string) => {
  if (code.length === 6 && /^\d+$/.test(code)) {
    return true
  }

  return false
}