import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Modal, SmallButton } from "../../components"
import { useSession } from "../../hooks"
import { getLists, List } from "../../services/lists/lists"

import {
  MainContainer,
  ContentContainer,
  Title,
  ListCardsContainer,
  ListCard,
  TitleContainer,
  ListTitleContainer,
  ListTitle
} from './styles'

export const Home = () => {
  const [userLists, setUserLists] = useState<List[]>()
  const [isCreateListModalOpened, setIsCreateListModalOpened] = useState(false)

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
    console.log(token)
  }, [token])

  const handleListClick = (listId: string) => {
    navigate(`/lists/${listId}`, { state: { listId } })
  }

  const handleCreateListClick = () => {
    setIsCreateListModalOpened(true)
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
            onClick={handleCreateListClick}
          />
        </TitleContainer>
        <ListCardsContainer>
          {userLists?.map((list) => (
            <ListCard key={list.id} onClick={() => handleListClick(list.id)}>
              <ListTitleContainer>
                <ListTitle>
                  {list.name}
                </ListTitle>
              </ListTitleContainer>
            </ListCard>
          ))}
        </ListCardsContainer>
      </ContentContainer>
      <Modal
        open={isCreateListModalOpened}
        setOpen={setIsCreateListModalOpened}
      >
        Create new list
      </Modal>
    </MainContainer>
  )
}