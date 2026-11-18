import dotenv from 'dotenv'

dotenv.config()

/**
 * Настройки, получаемые из переменных окружения (файл .env)
 */
export interface AppConfig {
  /** Базовый URL тестируемого API */
  baseUrl: string
  /** Имя пользователя по умолчанию */
  userName: string
  /** Пароль пользователя по умолчанию */
  current_password: string
  /** Заведомо невалидный пароль для негативных тестов (может быть не задан) */
  invalid_password?: string
}

const config: AppConfig = {
  baseUrl: process.env.BASE_URL ?? '',
  userName: process.env.USERNAME ?? '',
  current_password: process.env.PASSWORD ?? '',
  invalid_password: process.env.INVALID_PASSWORD,
}

export default config
