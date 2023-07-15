import { ChangeEvent } from 'react'
import styled from 'styled-components'

import { colors } from '../../helpers'

const InputField = styled.input<{ isValid: boolean }>`
  width: 100%;
  background: transparent;
  border: 1px solid ${({ isValid }) => isValid ? colors.grey.dark : colors.error};
  border-radius: 7.5px;
  outline: none;
  margin: 10px 0px;

  font-size: 16px;
  font-weight: 200;
  color: ${({ isValid }) => isValid ? colors.grey.dark : colors.error};
  font-family: poppins;

  width: 150px;
  height: 40px;
  padding-left: 15px;
`

export const TextInput = ({ value, handleChange, type, placeholder, onBlur, isValid }: { value: string, handleChange: (e: ChangeEvent<HTMLInputElement>) => unknown, type: string, placeholder: string, onBlur: () => unknown, isValid: boolean }) => {
  return (
    <InputField
      value={value}
      onChange={handleChange}
      type={type}
      placeholder={placeholder}
      onBlur={onBlur}
      isValid={isValid}
    />
  )
}