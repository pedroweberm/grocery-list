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
  onConfirm,
  isLoading,
  onCancel,
}: PropsWithChildren<{
  onConfirm: (name: string) => Promise<unknown>;
  isLoading: boolean;
  onCancel: () => unknown;
}>) => {
  const {
    value: newListName,
    isValid: isNewListNameValid,
    handleChange: handleNewListNameChange,
    onBlur: onNewListNameBlur,
    isDone: isNewListNameDone,
  } = useFormField(undefined, (text: string) => text.length >= 2);

  const handleConfirmButtonClick = useCallback(async () => {
    await onConfirm(newListName);
  }, [onConfirm, newListName]);

  return (
    <div className="grid grid-cols-3 grid-rows-4 w-full bg-purple-lightest p-4">
      <div className="flex flex-col row-span-3 col-span-3">
        <h2
          className={`
          text-3xl
          font-semibold
          leading-loose
          text-left
          text-purple-darkest
          font-sans
        `}
        >
          Name
        </h2>
        <TextInput
          handleChange={handleNewListNameChange}
          isValid={isNewListNameValid || !isNewListNameDone}
          placeholder="Ex.: family list"
          type="text"
          value={newListName}
          onBlur={onNewListNameBlur}
        />
      </div>
      <div className="row-span-1 col-span-3 flex flex-1 flex-row flex-between">
        <RoundedButton
          onClick={onCancel}
          text="Cancel"
          loading={isLoading}
          enabled={!isLoading}
          icon={false}
          secondary
          className="mr-3"
        />
        <RoundedButton
          text="Create"
          onClick={handleConfirmButtonClick}
          loading={isLoading}
          enabled={!isLoading}
          icon
          primary
          className="ml-3"
        />
      </div>
    </div>
  );
};

export const Home = () => {
  const [userLists, setUserLists] = useState<List[]>();
  const [isCreateListModalOpened, setIsCreateListModalOpened] = useState(false);
  const [isCreateListLoading, setIsCreateListLoading] = useState(false);

  const navigate = useNavigate();

  const onInvalid = useCallback(() => navigate("/sign-in"), [navigate]);

  const { token } = useSession({ onInvalid });

  const loadLists = useCallback(async () => {
    if (token) {
      const lists = await getLists(token);

      setUserLists(lists.data);
    }
  }, [token]);

  useEffect(() => {
    async function getUserLists() {
      await loadLists();
    }

    getUserLists();
  }, [loadLists]);

  const handleListClick = (listId: string) => {
    navigate(`/lists/${listId}`, { state: { listId } });
  };

  const handleCreateListClick = () => {
    setIsCreateListModalOpened(true);
  };

  const onCreateListConfirm = useCallback(
    async (name: string) => {
      if (token) {
        setIsCreateListLoading(true);
        const createListResponse = await createList({ name }, token);
        window.alert(createListResponse.data);
        setIsCreateListLoading(false);
        setIsCreateListModalOpened(false);
        await loadLists();
      }
    },
    [token, loadLists]
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
          onConfirm={onCreateListConfirm}
          isLoading={isCreateListLoading}
          onCancel={() => setIsCreateListModalOpened(false)}
        />
      </Modal>
    </MainContainer>
  );
};
