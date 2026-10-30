const baseUrl = 'https://bookstore.demoqa.com'
let createdUserName
let response_status

describe('Bookstore API', () => {
  beforeAll(async () => {
    createdUserName = `user_${Date.now()}`
    const response = await fetch(`${baseUrl}/Account/v1/User`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: createdUserName, password: 'Test@1234' }),
    })
    response_status = response.status
  })

  test('создание пользователя успешно', async () => {
    expect(response_status).toEqual(201)
  })

  test('создание пользователя с ошибкой — логин уже используется', async () => {
    const response = await fetch(
      `${baseUrl}/Account/v1/User`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: createdUserName,
        password: "Test@1234",
      }),
    })

    const data = await response.json()

    expect(data).toMatchObject({
      code: '1204',
      message: expect.stringContaining('User exists!')
    })
    expect(response.status).toEqual(406)
  })

  test('создание пользователя с ошибкой — пароль составлен не по правилам', async () => {
    const response = await fetch(
      `${baseUrl}/Account/v1/User`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: `user2_${Date.now()}`,
          password: "bad_password",
        }),
      })

    const data = await response.json()

    expect(data).toMatchObject({
      code: '1300',
      message: expect.stringContaining('Passwords must have')
    })
    expect(response.status).toEqual(400)
  })

  test('генерация токена с ошибкой', async () => {
    const response = await fetch(
      `${baseUrl}/Account/v1/GenerateToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: "nonexistent_user",
          password: "password_error",
        }),
      })

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
    const response = await fetch(
      `${baseUrl}/Account/v1/GenerateToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: createdUserName,
          password: "Test@1234",
        }),
      })

    const data = await response.json()

    expect(data.token).toBeTruthy()
    expect(data.expires).toBeTruthy()
    expect(data.status).toBe('Success')
    expect(data.result).toContain('User authorized successfully.')
    expect(response.status).toEqual(200)
  })
})
