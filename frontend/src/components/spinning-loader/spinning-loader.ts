import styled from "styled-components";

import { colors } from "../../helpers";

export const SpinningLoader = styled.div<{ primary?: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-left-color: ${({ primary }) => primary ? colors.purple.lightest : colors.purple.darkest};
  background: transparent;
  animation: rotate-s-loader 1s linear infinite;

  @keyframes rotate-s-loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
}
`