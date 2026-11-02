import { faker } from '@faker-js/faker'

export function generateUserName() {
  return { userName: faker.internet.email() }
}
