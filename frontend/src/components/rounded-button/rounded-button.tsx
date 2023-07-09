import type { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { FiArrowRight } from 'react-icons/fi'

import { colors } from '../../helpers'

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
  font-size: 18px;
  font-weight: 500;
  color: ${({ primary }) => primary ? colors.purple.lighest : colors.purple.darkest};

  margin-right: ${({ margin }) => margin ? '10px' : '0'};
`

const Button = styled.button<{ primary: boolean, enabled: boolean, marginLeft?: boolean, marginRight?: boolean }>`
  padding: 0px 20px;
  height: 80px;
  border-radius: 20px;

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

export const SpinningLoader = styled.div<{ primary: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-left-color: ${({ primary }) => primary ? colors.purple.lighest : colors.purple.darkest};
  background: transparent;
  animation: rotate-s-loader 1s linear infinite;
  margin: 6rem auto;

  @keyframes rotate-s-loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
}
`

export const RoundedButton = ({ loading, text, icon, primary, secondary, onClick, enabled, marginLeft, marginRight }: PropsWithChildren<RoundeButtonExtraProps>) => {
  const isPrimary = primary === true ? true : secondary === true ? false : true

  return (
    <Button onClick={onClick} primary={isPrimary} enabled={enabled} marginLeft={marginLeft} marginRight={marginRight} >
      <ButtonText primary={isPrimary} margin={icon}>{text}</ButtonText>
      {!loading
        ? icon && <FiArrowRight size={26} color={colors.purple.lighest} />
        : icon && <SpinningLoader primary={isPrimary} />
      }
    </Button>
  )
}