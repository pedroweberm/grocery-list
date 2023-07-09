import styled from 'styled-components'
import { colors } from '../../helpers'

export const MainContainer = styled.div`
  background: linear-gradient(180deg, ${colors.purple.medium} 1.54%, ${colors.purple.light} 100%);
  width: 100vw;
  min-height: 100vh;

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

export const RegisterContainer = styled.form`
  padding: 1em 1.5em;
  background: ${colors.purple.lighest};
  box-shadow: 0px 20px 40px ${colors.purple.medium};
  margin: 1em;
  margin-bottom: 2.5em;

  border-radius: 20px;

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

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
  margin: 0 0 10% 0;
`

export const RegisterInputLabel = styled.label`
  font-size: 20px;
  color: #4f00a9;
  font-weight: 600;
  text-align: left;
  font-family: poppins;
`