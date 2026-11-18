/**
 * Ответ API при генерации токена авторизации
 */
export interface TokenResponse {
  token: string | null
  expires: string | null
  status: string
  result: string
}

/**
 * Ответ API с кодом и текстом ошибки
 */
export interface ApiErrorResponse {
  code: string
  message: string
}
