import { useCallback, useEffect, useState, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

import { Modal, RoundedButton, SmallButton, TextInput } from "../../components";
import { useFormField, useSession } from "../../hooks";
import { getLists, List, createList } from "../../services/lists/lists";

import {
  MainContainer,
  ContentContainer,
  Title,
  ListCardsContainer,
  ListCard,
  TitleContainer,
  ListTitleContainer,
  ListTitle,
} from "./styles";

const CreateListComponent = ({
  handleCreateListConfirm,
  isLoading,
}: PropsWithChildren<{
  handleCreateListConfirm: () => unknown;
  isLoading: boolean;
}>) => {
  const {
    value: newListName,
    isValid: isNewListNameValid,
    handleChange: handleNewListNameChange,
  } = useFormField();

  return (
    <div className="grid grid-cols-3 grid-rows-5 w-full max-h-56 bg-purple-darkest">
      <div className="flex flex-col row-span-3 col-span-3">
        Name:
        <TextInput
          handleChange={handleNewListNameChange}
          isValid={isNewListNameValid}
          placeholder="My list"
          type="submit"
          value={newListName}
        />
      </div>
      <div className="row-span-1 col-span-3" />
      <div className="row-span-1 col-span-2" />
      <div className="flex row-span-1 col-span-1">
        <RoundedButton
          onClick={handleCreateListConfirm}
          text="Criar"
          loading={isLoading}
          enabled={!isLoading}
          className="w-3/4"
          icon={false}
        />
      </div>
    </div>
  );
};

export const Home = () => {
  const [userLists, setUserLists] = useState<List[]>();
  const [isCreateListModalOpened, setIsCreateListModalOpened] = useState(false);

  const navigate = useNavigate();

  const onInvalid = useCallback(() => navigate("/sign-in"), [navigate]);

  const { token } = useSession({ onInvalid });

  useEffect(() => {
    async function getUserLists() {
      if (token) {
        const lists = await getLists(token);

        setUserLists(lists.data);
      }
    }

    getUserLists();
    console.log(token);
  }, [token]);

  const handleListClick = (listId: string) => {
    navigate(`/lists/${listId}`, { state: { listId } });
  };

  const handleCreateListClick = () => {
    setIsCreateListModalOpened(true);
  };

  const handleCreateListConfirm = useCallback(
    async (name: string) => {
      await createList({ name }, token);
    },
    [token]
  );

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
                <ListTitle>{list.name}</ListTitle>
              </ListTitleContainer>
            </ListCard>
          ))}
        </ListCardsContainer>
      </ContentContainer>
      <Modal
        open={isCreateListModalOpened}
        setOpen={setIsCreateListModalOpened}
      >
        <CreateListComponent
          handleCreateListConfirm={handleCreateListConfirm}
        />
      </Modal>
    </MainContainer>
  );
};
