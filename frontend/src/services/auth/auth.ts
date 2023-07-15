import { Auth } from 'aws-amplify'

export const checkSession = async () => {
  try {
    const session = await Auth.currentSession()

    if (session.isValid()) {
      return {
        valid: true,
        session
      }
    }

    return { valid: false }
  } catch (error) {
    return {
      valid: false
    }
  }
}

export const signIn = async (username: string, password: string) => {
  try {
    const user = await Auth.signIn({ username, password })

    if (user) return { success: true, data: user }

    return { success: false }
  } catch (error) {
    return { success: false, data: error }
  }
}

export const startSignUp = async ({ username, phone, email, name, password }: { username: string, phone: string, email: string, name: string, password: string }) => {
  try {
    const response = await Auth.signUp({
      username,
      password,
      attributes: {
        email,
        phone_number: phone,
        name,
        preferred_username: username
      },
      autoSignIn: {
        enabled: false
      }
    })

    return { success: true, data: response }
  } catch (error) {
    console.error(error)

    return { succcess: false, data: error }
  }
}

export const confirmSignUp = async ({ username, code }: { username: string, code: string }) => {
  try {
    const response = await Auth.confirmSignUp(username, code)

    return { success: true, data: response }
  } catch (error) {
    console.error(error)

    return { succcess: false, data: error }
  }
}