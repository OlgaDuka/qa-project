import axios from 'axios'
import config from '../config/config.js'
import { apiUrls } from '../config/constants.js'

// Создаём экземпляр axios, чтобы не менять глобальные настройки
const api = axios.create({
  baseURL: config.baseUrl,
  headers: { 'Content-Type': 'application/json' },
})

// Не выбрасывать ошибку для статусов 4xx/5xx
api.defaults.validateStatus = () => true

/**
 * Авторизация пользователя
 * @param {string} userName - имя пользователя
 * @param {string} password - пароль
 * @returns {Promise<AxiosResponse>} ответ сервера
 */
export const authUser = (userName, password) => api.post(apiUrls.auth, { userName, password })

/**
 * Создание нового пользователя
 * @param {string} userName - имя пользователя
 * @param {string} password - пароль
 * @returns {Promise<AxiosResponse>} ответ сервера
 */
export const createUser = (userName, password) => api.post(apiUrls.user, { userName, password })

/**
 * Генерация токена авторизации
 * @param {string} userName - имя пользователя
 * @param {string} password - пароль
 * @returns {Promise<AxiosResponse>} ответ сервера
 */
export const getToken = (userName, password) => api.post(apiUrls.token, { userName, password })

/**
 * Получение данных пользователя по ID
 * @param {string} userId - ID пользователя
 * @param {string} token - токен авторизации
 * @returns {Promise<AxiosResponse>} ответ сервера
 */
export const getUser = (userId, token) =>
  api.get(`${apiUrls.user}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

/**
 * Удаление пользователя по ID
 * @param {string} userId - ID пользователя
 * @param {string} token - токен авторизации
 * @returns {Promise<AxiosResponse>} ответ сервера
 */
export const deleteUser = (userId, token) =>
  api.delete(`${apiUrls.user}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
