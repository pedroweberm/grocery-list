import { ChangeEvent } from "react";
import styled from "styled-components";

import { colors } from "../../helpers";

const InputField = styled.input.attrs({
  className: `
    w-full
    bg-transparent
    border
    border-solid
    
    rounded-lg
    outline-none
    mx-0
    my-2.5
    text-base
    font-extralight
    
    w-36
    h-10
    pl-3.5
    ${({ className }: { className: string }) => className}
  `,
})<{ isValid: boolean; className?: string }>`
  font-family: poppins;
  border-color: ${({ isValid }) =>
    isValid ? colors.purple.dark : colors.error};
  text-color: ${({ isValid }) =>
    isValid ? colors.grey.darkest : colors.error};
  &::placeholder {
    color: ${({ isValid }) => (isValid ? colors.grey.medium : colors.error)};
  }
`;

export const TextInput = ({
  value,
  handleChange,
  type,
  placeholder,
  onBlur,
  isValid,
  className,
}: {
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
  type: string;
  placeholder: string;
  onBlur?: () => unknown;
  isValid: boolean;
  className?: string;
}) => {
  return (
    <InputField
      value={value}
      onChange={handleChange}
      type={type}
      placeholder={placeholder}
      onBlur={onBlur}
      isValid={isValid}
      className={className}
    />
  );
};
