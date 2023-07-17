import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import debounce from 'lodash.debounce'

import { useSession, useIotRealTime, useAuthenticatedUser } from "../../hooks"
import { getListItems, getMQTTUrl, updateListItem, ListItem as ListItemType, ListEventPayload, createListItem } from "../../services/lists/lists"

import {
  MainContainer,
  ContentContainer,
  Title,
  ListItemsContainer,
  ListItemContainer,
  ListItemTextContainer,
  TitleContainer,
  SquareButton,
  PlusIcon,
  CheckIcon,
  MinusIcon,
  SectionTitle,
  ListItemText
} from './styles'

enum ListEvents {
  ITEM_CREATED = 'item-created',
  ITEM_UPDATED = 'item-updated',
  ITEM_DELETED = 'item-deleted',
}

const ListItem = ({ name, id, index, status, onUpdateName, onPressButton }:
  { name: string, id: string, index: number, status: string, onUpdateName: (itemId: string, name: string) => unknown, onPressButton: (itemId: string, status: string) => Promise<unknown> }) => {
  const [nameValue, setNameValue] = useState(name)

  const debouncedOnUpdateName = useCallback(debounce(onUpdateName, 1500, { trailing: true }), [])
  const onPresssButtonCallback = useCallback(() => onPressButton(id, status === 'pending' ? 'done' : 'pending'), [id, status, onPressButton])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value)

    debouncedOnUpdateName(id, e.target.value)
  }

  return (
    <ListItemContainer>
      <ListItemTextContainer index={index} key={id} >
        <ListItemText value={nameValue} onChange={handleNameChange} />
      </ListItemTextContainer>
      <SquareButton onClick={onPresssButtonCallback}>
        {status === 'pending' ? <CheckIcon /> : <MinusIcon />}
      </SquareButton>
    </ListItemContainer>
  )
}

const NewItemInput = ({ onPressButton }:
  { onPressButton: (itemName: string) => Promise<unknown> }) => {
  const [nameValue, setNameValue] = useState('')

  const onPresssButtonCallback = useCallback(() => {
    onPressButton(nameValue)
    setNameValue('')
  }, [nameValue, onPressButton])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value)
  }

  return (
    <ListItemContainer>
      <ListItemTextContainer>
        <ListItemText value={nameValue} onChange={handleNameChange} placeholder="Ex.: Bread" />
      </ListItemTextContainer>
      <SquareButton onClick={onPresssButtonCallback}>
        <PlusIcon />
      </SquareButton>
    </ListItemContainer>
  )
}

export const List = () => {
  const [items, setItems] = useState<ListItemType[]>([])
  const [iotUrl, setIotUrl] = useState<string>('')
  const [messages, setMessages] = useState<string[]>([])

  const { listId } = useParams()

  const { connectionStatus } = useIotRealTime(iotUrl,
    [
      `lists/${listId}/item-created`,
      `lists/${listId}/item-updated`,
      `lists/${listId}/item-deleted`
    ], (message: string) => {
      const parsed = JSON.parse(message)

      const event = parsed.event
      const data = parsed.data

      handleListEvent(event, data)
    })

  const navigate = useNavigate()

  const onInvalid = useCallback(() => navigate('/sign-in'), [navigate])

  const { token } = useSession({ onInvalid })
  const { user } = useAuthenticatedUser()

  const handleListEvent = useCallback((event: ListEvents, payload: ListEventPayload, isLocal = false) => {
    console.log(`Handling ${isLocal ? 'local ' : ''}event ${event} with payload ${JSON.stringify(payload, null, 2)}`)

    if (event === ListEvents.ITEM_DELETED) {
      setItems(items?.filter(item => item.id === payload.id))
      return
    }

    if (event === ListEvents.ITEM_CREATED) {
      if (!isLocal && payload.createdBy === user.sub) return
      setItems([...items, {
        id: payload.id,
        createdAtTimestamp: payload.createdAtTimestamp,
        itemCreatedBy: payload.createdBy,
        listId: payload.listId,
        name: payload.name,
        status: payload.status,
        itemUpdatedBy: payload.updatedBy
      }])
      return
    }
    if (event === ListEvents.ITEM_UPDATED) {
      if (!isLocal && payload.updatedBy === user.sub) return
      const updatedItems = [...items.filter(item => item.id !== payload.id), {
        id: payload.id,
        createdAtTimestamp: payload.createdAtTimestamp,
        itemCreatedBy: payload.createdBy,
        listId: payload.listId,
        name: payload.name,
        status: payload.status,
        itemUpdatedBy: payload.updatedBy
      }]
      setItems(updatedItems)
      return
    }
  }, [items, user])

  const onUpdateItemName = useCallback(async (itemId: string, name: string) => {
    if (listId && itemId && token && name) {
      updateListItem(listId, itemId, token, { name }).catch(error => console.error(error))
      const updatedItem = items.find(item => item.id === itemId) as ListItemType
      handleListEvent(ListEvents.ITEM_UPDATED, {
        createdAtTimestamp: updatedItem.createdAtTimestamp,
        createdBy: updatedItem.itemCreatedBy,
        id: updatedItem.id,
        listId: updatedItem.listId,
        status: updatedItem.status,
        updatedBy: updatedItem.itemUpdatedBy,
        name
      }, true)
    }
  }, [listId, token, handleListEvent, items])
  const onUpdateItemStatus = useCallback(async (itemId: string, status: string) => {
    if (listId && itemId && token) {
      updateListItem(listId, itemId, token, { status }).catch(error => console.error(error))
      const updatedItem = items.find(item => item.id === itemId) as ListItemType
      handleListEvent(ListEvents.ITEM_UPDATED, { 
        createdAtTimestamp: updatedItem.createdAtTimestamp,
        createdBy: updatedItem.itemCreatedBy,
        id: updatedItem.id,
        listId: updatedItem.listId,
        name: updatedItem.name,
        updatedBy: updatedItem.itemUpdatedBy,
        status
      }, true)
    }
  }, [listId, token, handleListEvent, items])
  const onCreateItem = useCallback(async (itemName: string) => {
    if (listId && itemName && token) {
      const createItemResponse = await createListItem(listId, itemName, token).catch(error => console.error(error))

      if (createItemResponse?.success && createItemResponse?.data)
      handleListEvent(ListEvents.ITEM_CREATED, {
        id: createItemResponse.data.itemId,
        createdAtTimestamp: createItemResponse.data.createdAtTimestamp,
        createdBy: createItemResponse.data.itemCreatedBy,
        listId: createItemResponse.data.itemListId,
        name: createItemResponse.data.itemName,
        status: createItemResponse.data.itemStatus,
      }, true)
    }
  }, [listId, token, handleListEvent])

  useEffect(() => {
    async function getIotUrl() {
      if (token && listId) {
        const response = await getMQTTUrl(listId, token)

        if (response.success && response.data?.url) {
          setIotUrl(response.data.url)
        }
      }
    }

    console.log(token)
    getIotUrl()
  }, [token, listId])

  useEffect(() => {
    console.log(`Connection status changed to`, connectionStatus)
  }, [connectionStatus])

  useEffect(() => {
    async function run() {
      if (token && listId) {
        const response = await getListItems(listId, token)

        setItems(response.data ?? [])
      }
    }

    run()
  }, [token, listId])

  return (
    <MainContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>List Tilte</Title>
        </TitleContainer>
        <NewItemInput
          onPressButton={onCreateItem}
        />
        <SectionTitle>Missing</SectionTitle>
        <ListItemsContainer>
          {items?.filter(item => item.status === 'pending').map((item, index) => (
            <ListItem
              key={item.id}
              name={item.name}
              id={item.id}
              index={index}
              status={item.status}
              onUpdateName={onUpdateItemName}
              onPressButton={onUpdateItemStatus}
            />
          ))}
        </ListItemsContainer>
        <SectionTitle>Done</SectionTitle>
        <ListItemsContainer>
          {items?.filter(item => item.status === 'done').map((item, index) => (
            <ListItem
              key={item.id}
              name={item.name}
              id={item.id}
              index={index}
              status={item.status}
              onUpdateName={onUpdateItemName}
              onPressButton={onUpdateItemStatus}
            />
          ))}
        </ListItemsContainer>
      </ContentContainer>
    </MainContainer>
  )
}