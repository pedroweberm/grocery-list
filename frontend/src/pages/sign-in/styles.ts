import styled from 'styled-components'

import { colors } from '../../helpers'

export const MainContainer = styled.div`
  background: linear-gradient(180deg, ${colors.purple.medium} 1.54%, ${colors.purple.light} 100%);
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`

export const ContentContainer = styled.div`
  position: relative;

  width: 100%;
  max-width: 1100px;

  height: 100%;
  max-height: 900px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

export const LoginContainer = styled.form`
  padding: 30px 25px;
  background: ${colors.purple.lighest};
  box-shadow: 0px 20px 40px ${colors.purple.medium};
  margin: 1em;

  border-radius: 30px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
`

export const Title = styled.h1`
  max-width: 400px;
  font-size: 3em;
  font-weight: 600;
  font-family: poppins;
  line-height: 70px;
  text-align: left;
  color: #F9F8F4;

  margin: 0.5em 0 0 0;
`

export const Description = styled.h1`
  max-width: 350px;
  font-size: 20px;
  font-weight: 200;
  line-height: 34px;
  margin-top: 40px;
  color: #F9F8F4;
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin: 0 0 10% 0;
`

export const LoginInputLabel = styled.label`
  font-size: 20px;
  color: #4f00a9;
  font-weight: 600;
  text-align: left;
  font-family: poppins;
`

export const SpinningLoader = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.8);
  border-left-color: rgb(0, 0, 0, 0.3);
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