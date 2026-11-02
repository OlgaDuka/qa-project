import axios from 'axios'
import config from '../framework/config/config.js'
import { generateUserName } from '../framework/fixtures/user_fixture.js'

axios.defaults.validateStatus = () => true

let createdUserName
let response_status
let createdToken
let userID

describe('Bookstore API', () => {
  beforeAll(async () => {
    createdUserName = generateUserName().userName
    const response = await axios.post(
      `${config.baseUrl}/Account/v1/User`,
      { userName: createdUserName, password: config.current_password },
      { headers: { 'Content-Type': 'application/json' } },
    )
    response_status = response.status
    userID = response.data.userID
  })

  test('создание пользователя успешно', async () => {
    expect(response_status).toEqual(201)
  })

  test('создание пользователя с ошибкой — логин уже используется', async () => {
    const response = await axios.post(
      `${config.baseUrl}/Account/v1/User`,
      {
        userName: createdUserName,
        password: config.current_password,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    expect(response.data).toMatchObject({
      code: '1204',
      message: expect.stringContaining('User exists!')
    })
    expect(response.status).toBe(406)
  })

  test('создание пользователя с ошибкой — пароль составлен не по правилам', async () => {
    const response = await axios.post(
      `${config.baseUrl}/Account/v1/User`,
      {
        userName: generateUserName().userName,
        password: config.invalid_password,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    expect(response.data).toMatchObject({
      code: '1300',
      message: expect.stringContaining('Passwords must have')
    })
    expect(response.status).toEqual(400)
  })

  test('генерация токена с ошибкой', async () => {
    const response = await axios.post(
      `${config.baseUrl}/Account/v1/GenerateToken`,
      {
        userName: "nonexistent_user",
        password: config.invalid_password,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    expect(response.status).toEqual(400)
  })

  // Данный тест падает - выявлена неверная работа АПИ, в доке указано, что должен возвращаться статус 400,
  // на самом деле при ошибке всегда возвращается 200. Кроме того, при ошибке должен вернуться объект вида:
  // {
  //   "code": 0,
  //   "message": "string"
  // },
  // однако реально получаем объект с такими же полями, как и при успешном выполнении, но с нулевым токеном:
  // {
  //     "token": null,
  //     "expires": null,
  //     "status": "Failed",
  //     "result": "User authorization failed."
  // }
  // Необходимо привести в соответствие работу АПИ и документацию

  test('генерация токена успешно', async () => {
    const response = await axios.post(
      `${config.baseUrl}/Account/v1/GenerateToken`,
      {
        userName: createdUserName,
        password: config.current_password,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )

    createdToken = response.data.token
    expect(response.data.token).toBeTruthy()
    expect(response.data.expires).toBeTruthy()
    expect(response.data.status).toBe('Success')
    expect(response.data.result).toContain('User authorized successfully.')
    expect(response.status).toEqual(200)
  })

  test('получение данных пользователя', async () => {
    const response = await axios.get(
      `${config.baseUrl}/Account/v1/User/${userID}`,
      { headers: { Authorization: `Bearer ${createdToken}` } }
    )

    expect(response.status).toBe(200)
    expect(response.data.username).toBe(createdUserName)
  })

  test('удаление пользователя', async () => {
    const response = await axios.delete(
      `${config.baseUrl}/Account/v1/User/${userID}`,
      { headers: { Authorization: `Bearer ${createdToken}` } }
    )

    expect(response.status).toBe(200)
  })

  // Тест удаления пользователя падает по такой же причине, как и генерация токена с ошибкой
  // Нужно привести документацию в соответствие с реальной работой бэкенда. В доке статус 200, а мы
  // получаем 204 No Content - стандартный статус для успешного DELETE-запроса без тела ответа.
})
