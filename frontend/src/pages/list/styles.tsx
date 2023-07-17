import styled from 'styled-components'
import { FiPlus, FiCheck, FiMinus } from 'react-icons/fi'

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

  width: 95%;
`

export const ListItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const ListItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 95%;
`

export const ListItemTextContainer = styled.div<{ index?: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 1em 0.5em;

  border-radius: 15px;
  background: ${({ index }) => {
    if (index === undefined) return colors.purple.lighest

    const remainder = index % 5;

    switch (remainder) {
      case 0:
        return colors.accent.green;
      case 1:
        return colors.accent.orange;
      case 2:
        return colors.accent.pink;
      case 3:
        return colors.accent.purple;
      case 4:
        return colors.accent.yellow;
    }
  }};
`

export const PlusIcon = () => <FiPlus size={32} color={'#fff'} />
export const CheckIcon = () => <FiCheck size={32} color={'#fff'} />
export const MinusIcon = () => <FiMinus size={32} color={'#fff'} />

export const SquareButton = styled.button`
  padding: 10px;
  margin: 5px 0px 5px 5px;
  border-radius: 12px;

  background: ${colors.purple.darkest};
  border-color: ${colors.purple.darkest};
  border-width: 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background box-shadow 0.2s;
  
  &:hover {
    background: ${colors.purple.light};
    box-shadow: 0px 15px 30px ${colors.purple.medium};
    border-color: ${colors.purple.darkest};
  }
`

export const SectionTitle = styled.h2`
  max-width: 400px;
  font-size: 2em;
  font-weight: 600;
  font-family: poppins;
  line-height: 50px;
  text-align: left;
  color: #F9F8F4;

  margin: 0;
  align-self: start;
`

export const ListItemText = styled.input`
  font-size: 1em;
  font-weight: 600;
  font-family: poppins;
  text-align: left;
  color: #000;
  background: transparent;
  border-width: 0;

  margin: 0;
`

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