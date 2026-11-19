import axios from 'axios'
import type { AxiosResponse } from 'axios'
import config from '../config/config'
import { apiUrls } from '../config/constants'

/**
 * ISBN книги — элемент коллекции пользователя
 */
export interface BookIsbn {
  isbn: string
}

/**
 * Ответ сервера со списком книг
 */
export interface BooksResponse {
  books: BookIsbn[]
}

// Создаём экземпляр axios, чтобы не менять глобальные настройки
const api = axios.create({
  baseURL: config.baseUrl,
  headers: { 'Content-Type': 'application/json' },
})

// Не выбрасывать ошибку для статусов 4xx/5xx
api.defaults.validateStatus = (): boolean => true

/**
 * Авторизация пользователя
 * @param userName - имя пользователя
 * @param password - пароль
 * @returns ответ сервера
 */
export const authUser = (userName: string, password: string): Promise<AxiosResponse> =>
  api.post(apiUrls.auth, { userName, password })

/**
 * Создание нового пользователя
 * @param userName - имя пользователя
 * @param password - пароль
 * @returns ответ сервера
 */
export const createUser = (userName: string, password: string): Promise<AxiosResponse> =>
  api.post(apiUrls.user, { userName, password })

/**
 * Генерация токена авторизации
 * @param userName - имя пользователя
 * @param password - пароль
 * @returns ответ сервера
 */
export const getToken = (userName: string, password: string): Promise<AxiosResponse> =>
  api.post(apiUrls.token, { userName, password })

/**
 * Получение данных пользователя по ID
 * @param userId - ID пользователя
 * @param token - токен авторизации
 * @returns ответ сервера
 */
export const getUser = (userId: string, token: string): Promise<AxiosResponse> =>
  api.get(`${apiUrls.user}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

/**
 * Удаление пользователя по ID
 * @param userId - ID пользователя
 * @param token - токен авторизации
 * @returns ответ сервера
 */
export const deleteUser = (userId: string, token: string): Promise<AxiosResponse> =>
  api.delete(`${apiUrls.user}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

/**
 * Получение списка всех книг
 * @returns ответ сервера с массивом книг
 */
export const getBooks = (): Promise<AxiosResponse<BooksResponse>> => api.get<BooksResponse>(`${apiUrls.books}`)

/**
 * Добавление коллекции книг в список пользователя
 * @param userId - ID пользователя
 * @param collectionOfIsbns - массив ISBN добавляемых книг
 * @param token - токен авторизации
 * @returns ответ сервера
 */
export const postBooks = (userId: string, collectionOfIsbns: BookIsbn[], token: string): Promise<AxiosResponse> =>
  api.post(`${apiUrls.books}`, { userId, collectionOfIsbns }, { headers: { Authorization: `Bearer ${token}` } })

/**
 * Удаление всех книг пользователя
 * @param userId - ID пользователя
 * @param token - токен авторизации
 * @returns ответ сервера
 */
export const deleteBooks = (userId: string, token: string): Promise<AxiosResponse> =>
  api.delete(`${apiUrls.books}?UserId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

/**
 * Добавление книги в список пользователя
 * @param userId - ID пользователя
 * @param isbn - ISBN заменяемой книги в коллекции пользователя
 * @param replaceIsbn - ISBN добавляемой книги
 * @param token - токен авторизации
 * @returns ответ сервера
 */
export const putBooks = (userId: string, isbn: string, replaceIsbn: string, token: string): Promise<AxiosResponse> =>
  api.put(
    `${apiUrls.books}/${isbn}`,
    { userId, isbn: `${replaceIsbn}` },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

/**
 * Получение информации о книге по ISBN
 * @param isbn - ISBN книги
 * @returns ответ сервера с данными книги
 */
export const getBook = (isbn: string): Promise<AxiosResponse> => api.get(`${apiUrls.book}?ISBN=${isbn}`)

/**
 * Удаление книги из списка пользователя
 * @param isbn - ISBN удаляемой книги
 * @param userId - ID пользователя
 * @param token - токен авторизации
 * @returns ответ сервера
 */
export const deleteBook = (isbn: string, userId: string, token: string): Promise<AxiosResponse> =>
  api.delete(`${apiUrls.book}`, {
    data: { isbn, userId },
    headers: { Authorization: `Bearer ${token}` },
  })
