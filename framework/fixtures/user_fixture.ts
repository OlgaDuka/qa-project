import { faker } from '@faker-js/faker'

/**
 * Данные пользователя, сгенерированные для теста
 */
export interface GeneratedUser {
  userName: string
}

/**
 * Генерирует случайное имя пользователя (email)
 *
 * @returns объект с именем пользователя
 */
export function generateUserName(): GeneratedUser {
  return { userName: faker.internet.email() }
}
