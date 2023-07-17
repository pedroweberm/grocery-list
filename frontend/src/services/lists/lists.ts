import axios from 'axios'

import { config } from "../../config";

type ListsApiResponse<T> = {
  success: boolean,
  message: string,
  data: T
}

interface CreateListParameters {
  name: string
}

export interface List {
  id: string,
  name: string,
  ownerId: string,
  createdAtTimestamp: number,
}

export interface ListItem {
  id: string,
  name: string,
  status: string,
  itemCreatedBy: string,
  itemUpdatedBy?: string,
  listId: string,
  createdAtTimestamp: number,
}

export interface ListEventPayload {
  id: string,
  name: string,
  status: string,
  createdBy: string,
  listId: string,
  createdAtTimestamp: number,
  updatedBy?: string,
}

const API_BASE_URL = config.listsApiBaseUrl
const STAGE = config.listsApiStage

const endpoints = {
  createList: `/${STAGE}/lists`,
  getLists: `/${STAGE}/lists`,
  addListMember: `/${STAGE}/lists/:listId/members`,
  createListItem: `/${STAGE}/lists/:listId/items`,
  updateListItem: `/${STAGE}/lists/:listId/items/:itemId`,
  deleteListItem: `/${STAGE}/lists/:listId/items/:itemId`,
  getListItems: `/${STAGE}/lists/:listId/items`,
  getPresignedUrl: `/${STAGE}/lists/:listId/presigned-url`,
};

const getRequestConfig = (token: string) => ({ headers: { Authorization: token } })

const replacePathParameters = (path: string, values: { [key: string]: string }) =>
  Object.entries(values).reduce((acc, [key, value]) => acc.replace(`:${key}`, value), path);

const httpClient = axios.create({ baseURL: API_BASE_URL })

export const createList = async (data: CreateListParameters, token: string) => {
  try {
    const response = await httpClient.post(endpoints.createList, data, getRequestConfig(token))

    return { success: response.data.success, data: response.data.data }
  } catch (error) {
    console.error('Error while creating list', error)

    return { success: false }
  }
}

export const getLists = async (token: string) => {
  try {
    const response = await httpClient.get<ListsApiResponse<List[]>>(endpoints.getLists, getRequestConfig(token))

    return { success: response.data.success, data: response.data.data }
  } catch (error) {
    console.error('Error while getting lists', error)

    return { success: false }
  }
}

export const getListItems = async (listId: string, token: string) => {
  try {
    const response = await httpClient.get<ListsApiResponse<ListItem[]>>(replacePathParameters(endpoints.getListItems, { listId }), getRequestConfig(token))

    return { success: response.data.success, data: response.data.data }
  } catch (error) {
    console.error('Error while getting list items', error)

    return { success: false }
  }
}

export const updateListItem = async (listId: string, itemId: string, token: string, data: { name?: string, status?: string }) => {
  try {
    console.log('Sending request to update list item', itemId)
    const response = await httpClient.patch<ListsApiResponse<any>>(replacePathParameters(endpoints.updateListItem, { listId, itemId }), data, getRequestConfig(token))

    return { success: response.data.success, data: response.data.data }
  } catch (error) {
    console.error('Error while updating list item', error)

    return { success: false }
  }
}

export const getMQTTUrl = async (listId: string, token: string) => {
  try {
    const response = await httpClient.get<ListsApiResponse<{ url: string }>>(replacePathParameters(endpoints.getPresignedUrl, { listId }), getRequestConfig(token))

    return { success: response.data.success, data: response.data.data }
  } catch (error) {
    console.error('Error while getting presigned url', error)

    return { success: false }
  }
}