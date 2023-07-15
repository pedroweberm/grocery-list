import type { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { FiArrowRight } from 'react-icons/fi'

import { colors } from '../../helpers'
import { SpinningLoader } from '../spinning-loader/spinning-loader'

interface RoundeButtonExtraProps {
  enabled: boolean
  loading?: boolean
  icon?: boolean

  onClick: () => unknown

  text?: string
  marginLeft?: boolean
  marginRight?: boolean
  primary?: boolean
  secondary?: boolean
}

const ButtonText = styled.h2<{ primary: boolean, margin?: boolean }>`
  font-family: poppins;
  font-size: 14px;
  font-weight: 600;
  color: ${({ primary }) => primary ? colors.purple.lighest : colors.purple.darkest};

  margin-right: ${({ margin }) => margin ? '10px' : '0'};
`

const Button = styled.button<{ primary: boolean, enabled: boolean, marginLeft?: boolean, marginRight?: boolean }>`
  padding: 0px 5px;
  height: 35px;
  border-radius: 5px;

  opacity: ${({ enabled }: { enabled: boolean }) => enabled ? '100%' : '40%'};

  background: ${({ primary }) => primary ? colors.purple.darkest : 'transparent'};
  border-color: ${({ primary }) => primary ? colors.purple.darkest : colors.purple.darkest};
  border-width: ${({ primary }) => primary ? '2px' : '2px'};

  margin-right: ${({ marginLeft }) => marginLeft ? '10px' : '0px'};
  margin-left: ${({ marginRight }) => marginRight ? '10px' : '0px'};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  transition: background box-shadow 0.2s;
  
  pointer-events: ${({ enabled }: { enabled: boolean }) => enabled ? 'initial' : 'none'};
  
  cursor: ${({ enabled }: { enabled: boolean }) => enabled ? 'pointer' : 'not-allowed'};
  
  &:hover {
    background: ${({ enabled, primary }) => enabled ? (primary ? colors.purple.darkest : colors.purple.light) : (colors.grey.light)};
    box-shadow: 0px 15px 30px ${colors.purple.medium};
    border-color: ${({ primary }) => primary ? colors.purple.light : colors.purple.darkest};
  }
`

export const SmallButton = ({ text, icon, primary, secondary, onClick, enabled, marginLeft, marginRight }: PropsWithChildren<RoundeButtonExtraProps>) => {
  const isPrimary = primary === true ? true : secondary === true ? false : true

  return (
    <Button onClick={onClick} primary={isPrimary} enabled={enabled} marginLeft={marginLeft} marginRight={marginRight} >
      <ButtonText primary={isPrimary} margin={icon}>{text}</ButtonText>
      {icon && <FiArrowRight size={26} color={colors.purple.lighest} />}
    </Button>
  )
}