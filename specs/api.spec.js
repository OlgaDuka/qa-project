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

    expect(response.status).toEqual(406)
    expect(data.code).toBe('1204')
    expect(data.message).toContain('User exists!')
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

    expect(response.status).toEqual(400)
    expect(data.code).toBe('1300')
    expect(data.message).toContain('Passwords must have')
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

    const data = await response.json()

    expect(response.status).toEqual(200)
    expect(data.status).toBe('Failed')
    expect(data.result).toContain('User authorization failed.')
  })

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

    expect(response.status).toEqual(200)
    expect(data.token).toBeTruthy()
    expect(data.status).toBe('Success')
    expect(data.result).toContain('User authorized successfully.')
  })
})
