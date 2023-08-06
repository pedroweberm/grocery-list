import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useFormField } from '../../hooks'
import { confirmSignUp } from '../../services'
import { RoundedButton, TextInput } from '../../components'
import { validationCodeValidator } from '../../helpers'

import {
  MainContainer,
  ContentContainer,
  Title,
  ButtonsContainer,
  RegisterContainer,
  RegisterInputLabel,
} from './styles'

export const ConfirmSignUp = () => {
  const { value: code, isValid: isCodeValid, handleChange: handleCodeChange, onBlur: onCodeBlur, isDone: isCodeDone } = useFormField('', validationCodeValidator)

  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  async function handleSubmit() {
    setLoading(true)
    const response = await confirmSignUp({ username: location?.state?.username, code })
    setLoading(false)

    if (response.success) {
      navigate('/sign-in', { state: { username: location.state.username } })
    } else {
      window.alert(response.data)
    }
  }

  function handleCancelClick() {
    navigate('/sign-in')
  }

  return (
    <MainContainer>
      <ContentContainer>
        <Title>Type your<br/>Verification code</Title>
        <RegisterContainer>
          <RegisterInputLabel>
            Code
          </RegisterInputLabel>
          <TextInput
            value={code}
            handleChange={handleCodeChange}
            type='number'
            placeholder='Ex.: 123456'
            onBlur={onCodeBlur}
            isValid={isCodeValid || !isCodeDone}
          />
        </RegisterContainer>
        <ButtonsContainer>
          <RoundedButton
              text={'Cancel'}
              enabled={true}
              onClick={handleCancelClick}
              marginLeft
              secondary
            />
            <RoundedButton
              text={'Confirm'}
              enabled={isCodeValid}
              onClick={handleSubmit}
              loading={loading}
              marginRight
              icon
              primary
            />
        </ButtonsContainer>
      </ContentContainer>
    </MainContainer>
  )
}