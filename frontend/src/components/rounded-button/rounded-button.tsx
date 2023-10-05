import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";

import { colors } from "../../helpers";
import { SpinningLoader } from "../spinning-loader/spinning-loader";

interface RoundeButtonExtraProps {
  enabled: boolean;
  loading?: boolean;
  icon?: boolean;

  onClick: () => unknown;

  text?: string;
  marginLeft?: boolean;
  marginRight?: boolean;
  primary?: boolean;
  secondary?: boolean;
  className?: string;
}

const ButtonText = styled.h2<{ primary: boolean; margin?: boolean }>`
  font-family: poppins;
  font-size: 18px;
  font-weight: 500;
  color: ${({ primary }) =>
    primary ? colors.purple.lighest : colors.purple.darkest};
  flex: 1;

  margin-right: ${({ margin }) => (margin ? "10px" : "0")};
`;

interface ButtonProps {
  enabled: boolean;
  primary: boolean;
}

const Button = styled.button.attrs({
  className: `
    flex
    flex-1
    flex-row
    items-center
    content-between
    border-purple-darkest
    border-2
    ${({ className }: { className: string }) => className}
  `,
})<{
  primary: boolean;
  enabled: boolean;
  marginLeft?: boolean;
  marginRight?: boolean;
}>`
  border-radius: 10%;
  opcity: ${({ enabled }: ButtonProps) => (enabled ? "100%" : "40%")};
  background: ${({ primary }) =>
    primary ? colors.purple.darkest : "transparent"};

  transition: background box-shadow 0.2s;

  pointer-events: ${({ enabled }: { enabled: boolean }) =>
    enabled ? "initial" : "none"};

  cursor: ${({ enabled }: { enabled: boolean }) =>
    enabled ? "pointer" : "not-allowed"};

  &:hover {
    background: ${({ enabled, primary }) =>
      enabled
        ? primary
          ? colors.purple.darkest
          : colors.purple.light
        : colors.grey.light};
    box-shadow: 0px 15px 30px ${colors.purple.medium};
    border-color: ${({ primary }) =>
      primary ? colors.purple.light : colors.purple.darkest};
  }
`;

export const RoundedButton = ({
  loading,
  text,
  icon,
  primary,
  secondary,
  onClick,
  enabled,
  marginLeft,
  marginRight,
  className,
}: PropsWithChildren<RoundeButtonExtraProps>) => {
  const isPrimary = primary === true ? true : secondary === true ? false : true;

  return (
    <Button
      onClick={onClick}
      primary={isPrimary}
      enabled={enabled}
      marginLeft={marginLeft}
      marginRight={marginRight}
      className={className}
    >
      <ButtonText primary={isPrimary} margin={icon}>
        {text}
      </ButtonText>
      {icon ? (
        loading ? (
          <SpinningLoader primary={isPrimary} />
        ) : (
          <FiArrowRight size={26} color={colors.purple.lighest} />
        )
      ) : undefined}
    </Button>
  );
};
