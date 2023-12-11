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
  justify-content: flex-start;
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 90%;
`

export const ListCardsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  width: 100%;
  align-items: center;
`

export const ListCard = styled.div.attrs({
  className: "bg-purple-lightest flex items-center content-center"
})`
  flex-shrink: 0;
  width: 80%;
  max-width: 300px;
  height: 200px;
  border-radius: 20px;
  margin-left: 5%;
  margin-right: 2.5%;
`

export const ListTitleContainer = styled.div.attrs({
  className: "w-full bg-purple-darkest flex items-center content-start"
})``

export const ListTitle = styled.p.attrs({
  className: "text-xl font-semibold text-purple-lightest py-6 px-2"
})``

export const Title = styled.h1`
  max-width: 400px;
  font-size: 3em;
  font-weight: 600;
  font-family: poppins;
  line-height: 70px;
  text-align: left;
  color: #F9F8F4;

  margin: 0;
`