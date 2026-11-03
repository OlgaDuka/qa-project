import axios from 'axios'
import config from '../config/config.js'

// Создаём экземпляр axios, чтобы не менять глобальные настройки
const api = axios.create({
  baseURL: config.baseUrl,
  headers: { 'Content-Type': 'application/json' },
})

// Не выбрасывать ошибку для статусов 4xx/5xx
api.defaults.validateStatus = () => true

export const authUser = (userName, password) => api.post('/Account/v1/Authorized', { userName, password })

export const createUser = (userName, password) => api.post('/Account/v1/User', { userName, password })

export const getToken = (userName, password) => api.post('/Account/v1/GenerateToken', { userName, password })

export const getUser = (userId, token) =>
  api.get(`/Account/v1/User/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const deleteUser = (userId, token) =>
  api.delete(`/Account/v1/User/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
