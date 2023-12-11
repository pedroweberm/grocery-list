import type { PropsWithChildren } from "react";
import { FiArrowRight } from "react-icons/fi";

import { colors } from "../../helpers";
import { SpinningLoader } from "../spinning-loader/spinning-loader";

interface RoundeButtonExtraProps {
  enabled: boolean;
  loading?: boolean;
  icon?: boolean;

  onClick: (params: any) => unknown;

  text?: string;
  marginLeft?: boolean;
  marginRight?: boolean;
  primary?: boolean;
  secondary?: boolean;
  className?: string;
}

export const RoundedButton = ({
  loading,
  text,
  icon,
  primary,
  secondary,
  onClick,
  enabled,
  className,
}: PropsWithChildren<RoundeButtonExtraProps>) => {
  const isPrimary = primary === true ? true : secondary === true ? false : true;

  return (
    <button
      onClick={onClick}
      className={`
        flex
        flex-1
        flex-row
        items-center
        content-between
        border-purple-darkest
        border-2
        opacity-${enabled ? "100" : "40"}
        bg-${isPrimary ? "purple-darkest" : "transparent"}
        transition-all
        pointer-events-${enabled ? "auto" : "none"}
        cursor-${enabled ? "pointer" : "not-allowed"}
        hover:bg-${
          enabled
            ? isPrimary
              ? "purple-darkest"
              : "purple-light"
            : "grey-light"
        }
        hover:shadow-purple-medium
        hover:shadow-xl
        hover:border-${isPrimary ? "purple-light" : "purple-darkest"}
    }
        ${className}
      `}
    >
      <h2
        className={`
          font-poppins
          text-lg
          font-medium
          flex-1
          text-${isPrimary ? "purple-lightest" : "purple-darkest"}
      `}
      >
        {text}
      </h2>
      {icon ? (
        <div className="ml-2">
          {loading ? (
            <SpinningLoader primary={isPrimary} />
          ) : (
            <FiArrowRight size={26} color={colors.purple.lightest} />
          )}
        </div>
      ) : undefined}
    </button>
  );
};
