import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useFormField } from '../../hooks'
import { startSignUp } from '../../services'

import {
  MainContainer,
  ContentContainer,
  Title,
  ButtonsContainer,
  RegisterContainer,
  RegisterInputLabel
} from './styles'
import { RoundedButton, TextInput } from '../../components'
import { emailValidator, nameValidator, passwordValidator, phoneNumberValidator, usernameValidator } from '../../helpers'

export const SignUp = () => {
  const { value: username, isValid: isUsernameValid, handleChange: handleUsernameChange, onBlur: onUsernameBlur, isDone: isUsernameDone } = useFormField('', usernameValidator)
  const { value: password, isValid: isPasswordValid, handleChange: handlePasswordChange, onBlur: onPasswordBlur, isDone: isPasswordDone } = useFormField('', passwordValidator)
  const { value: phoneNumber, isValid: isPhoneNumberValid, handleChange: handlePhoneNumberChange, onBlur: onPhoneNumberBlur, isDone: isPhoneNumberDone } = useFormField('', phoneNumberValidator)
  const { value: email, isValid: isEmailValid, handleChange: handleEmailChange, onBlur: onEmailBlur, isDone: isEmailDone } = useFormField('', emailValidator)
  const { value: name, isValid: isNameValid, handleChange: handleNameChange, onBlur: onNameBlur, isDone: isNameDone } = useFormField('', nameValidator)

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit() {
    setLoading(true)
    const response = await startSignUp({ username, password, name, phone: phoneNumber, email })
    setLoading(false)

    if (response.success) {
      navigate('/confirm-sign-up', { state: { username } })
    } else {
      window.alert(response.data)
    }
  }

  function handleSignInClick() {
    navigate('/sign-in')
  }

  return (
    <MainContainer>
      <ContentContainer>
        <Title>Create<br/>Account</Title>
        <RegisterContainer>
          <RegisterInputLabel>
            Username
          </RegisterInputLabel>
          <TextInput
            value={username}
            handleChange={handleUsernameChange}
            type='text'
            placeholder='Ex.: john_doe'
            onBlur={onUsernameBlur}
            isValid={isUsernameValid || !isUsernameDone}
          />
          <RegisterInputLabel >
            Phone number
          </RegisterInputLabel>
          <TextInput
            value={phoneNumber}
            handleChange={handlePhoneNumberChange}
            type='text'
            placeholder='(99)99999-9999'
            onBlur={onPhoneNumberBlur}
            isValid={isPhoneNumberValid || !isPhoneNumberDone}
          />
          <RegisterInputLabel >
            E-mail
          </RegisterInputLabel>
          <TextInput
            value={email}
            handleChange={handleEmailChange}
            type='text'
            placeholder='john.doe@email.com'
            onBlur={onEmailBlur}
            isValid={isEmailValid || !isEmailDone}
          />
          <RegisterInputLabel >
            Name
          </RegisterInputLabel>
          <TextInput
            value={name}
            handleChange={handleNameChange}
            type='text'
            placeholder='John Doe'
            onBlur={onNameBlur}
            isValid={isNameValid || !isNameDone}
          />
          <RegisterInputLabel >
            Password
          </RegisterInputLabel>
          <TextInput
            value={password}
            handleChange={handlePasswordChange}
            type='password'
            placeholder='Your password'
            onBlur={onPasswordBlur}
            isValid={isPasswordValid || !isPasswordDone}
          />
        </RegisterContainer>
        <ButtonsContainer>
          <RoundedButton
            text={"Sign In"}
            enabled={true}
            onClick={handleSignInClick}
            marginLeft
            secondary
          />
          <RoundedButton
            text={"Register"}
            enabled={isUsernameValid && isPasswordValid && isPhoneNumberValid && isEmailValid && isNameValid}
            onClick={handleSubmit}
            loading={loading}
            icon
            marginRight
            primary
          />
        </ButtonsContainer>
      </ContentContainer>
    </MainContainer>
  )
}