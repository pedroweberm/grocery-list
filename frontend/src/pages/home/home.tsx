import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { SmallButton } from "../../components"
import { useSession } from "../../hooks"
import { getLists, List } from "../../services/lists/lists"

import {
  MainContainer,
  ContentContainer,
  Title,
  ListCardsContainer,
  ListCard,
  TitleContainer
} from './styles'

export const Home = () => {
  const [userLists, setUserLists] = useState<List[]>()

  const navigate = useNavigate()

  const onInvalid = useCallback(() => navigate('/sign-in'), [navigate])

  const { token } = useSession({ onInvalid })

  useEffect(() => {
    async function getUserLists() {
      if (token) {
        const lists = await getLists(token)

        setUserLists(lists.data)
      }
    }

    getUserLists()
  }, [token])

  const handleListClick = (listId: string) => {
    navigate(`/lists/${listId}`, { state: { listId } })
  }

  return (
    <MainContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>My Lists</Title>
          <SmallButton
            enabled
            primary
            text="New"
            onClick={() => window.alert('New list')}
          />
        </TitleContainer>
        <ListCardsContainer>
          {userLists?.map((list) => (
            <ListCard key={list.id} onClick={() => handleListClick(list.id)}>{list.name}</ListCard>
          ))}
        </ListCardsContainer>
      </ContentContainer>
    </MainContainer>
  )
}