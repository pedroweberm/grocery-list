import { Auth } from 'aws-amplify'

export interface AuthenticatedUser {
  email: string
  email_verified: boolean
  name: string
  phone_number: string
  phone_number_verified: boolean
  preferred_username: string
  sub: string
}

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

export const getToken = async () => {
  try {
    const session = await Auth.currentSession()

    return { success: true, token: session.getIdToken().getJwtToken() }

  } catch (error) {
    console.error('error while getting token', error)

    return { success: false }
  }
}

export const getAuthenticatedUser = async () => {
  try {
    const userData: AuthenticatedUser = (await Auth.currentAuthenticatedUser()).attributes

    return { success: true, user: userData }
  } catch (error) {
    console.error('error while getting authenticated user', error)

    return { success: false }
  }
}