import { createUser, getBooks, getToken, postBooks, deleteBooks, putBooks, getBook, deleteBook, authUser } from '../framework/services/api_axios'
import config from '../framework/config/config.js'
import { generateUserName } from '../framework/fixtures/user_fixture.js'

let createdUserName
let createdToken
let userID
let isbnList

describe('Bookstore API', () => {
  beforeAll(async () => {
    // 1. Создаём пользователя
    createdUserName = generateUserName().userName
    const userResponse = await createUser(createdUserName, config.current_password)
    userID = userResponse.data.userID

    // 2. Генерируем токен
    const tokenResponse = await getToken(createdUserName, config.current_password)
    createdToken = tokenResponse.data.token

    // 3. Авторизуем пользователя
    const isUserAuth = await authUser(createdUserName, config.current_password)

    console.log('isUserAuth: ', isUserAuth.data)

    // 4. Получаем список ISBN
    const booksResponse = await getBooks()

    // eslint-disable-next-line jest/no-standalone-expect
    expect(booksResponse.status).toBe(200)
    // eslint-disable-next-line jest/no-standalone-expect
    expect(booksResponse.data.books).toBeInstanceOf(Array)
    // eslint-disable-next-line jest/no-standalone-expect
    expect(booksResponse.data.books.length).toBeGreaterThan(0)

    isbnList = booksResponse.data.books.map(book => book.isbn)
  }, 15000)

  test('получить информацию о несуществующей книге', async () => {
    const isbn = '1234567890'
    const response = await getBook(isbn)

    expect(response.data).toMatchObject({
      code: '1205',                            // в контракте указан Number
      message: 'ISBN supplied is not available in Books Collection!'
    })
    expect(response.status).toBe(400)
  })

  test('получить информацию о книге', async () => {
    const isbn = isbnList[2]
    const response = await getBook(isbn)

    expect(response.data).toEqual({
      isbn: isbn,
      title: expect.any(String),
      subTitle: expect.any(String),
      author: expect.any(String),
      publish_date: expect.any(String),
      publisher: expect.any(String),
      pages: expect.any(Number),
      description: expect.any(String),
      website: expect.any(String),
    })
    expect(response.status).toBe(200)
  })

  test('добавление книг в список пользователя без токена', async () => {
    const booksToAdd = isbnList.slice(0, 3)
    const collectionOfIsbns = booksToAdd.map(isbn => ({ isbn }))
    const response = await postBooks(userID, collectionOfIsbns, '')

    expect(response.data).toMatchObject({
      code: '1200',                            // в контракте указан Number
      message: 'User not authorized!'
    })
    expect(response.status).toBe(401)
  })

  test('добавление несуществующей книги в список пользователя', async () => {
    const collectionOfIsbns = [ {"isbn" : "123456789" } ]
    const response = await postBooks(userID, collectionOfIsbns, createdToken)

    expect(response.data).toMatchObject({
      code: '1205',                            // в контракте указан Number
      message: 'ISBN supplied is not available in Books Collection!'
    })
    expect(response.status).toBe(400)
  })

  test('добавление книг в список пользователя', async () => {
    const booksToAdd = isbnList.slice(0, 3)
    const collectionOfIsbns = booksToAdd.map(isbn => ({ isbn }))
    const response = await postBooks(userID, collectionOfIsbns, createdToken)

    expect(response.data.books).toBeInstanceOf(Array)
    expect(response.data.books.length).toBe(booksToAdd.length)
    expect(response.data).toMatchObject({
      books: [
        { isbn: `${booksToAdd[0]}` },
        { isbn: `${booksToAdd[1]}` },
        { isbn: `${booksToAdd[2]}` },
      ]
    })
    expect(response.status).toBe(201)
  })

  test('замена книги в списке пользователя без токена', async () => {
    const isbn = isbnList[0]
    const replaceIsbn = isbnList[5]
    const response = await putBooks(userID, isbn, replaceIsbn, '')

    expect(response.data).toMatchObject({
      code: '1200',                            // в контракте указан Number
      message: 'User not authorized!'
    })
    expect(response.status).toBe(401)
  })


  test('замена книги в списке пользователя', async () => {
    const isbn = isbnList[0]
    const replaceIsbn = isbnList[5]
    const response = await putBooks(userID, isbn, replaceIsbn, createdToken)

    expect(response.data).toMatchObject({
      userId: `${userID}`,
      username: `${createdUserName}`,
      books: [
        { isbn: `${isbnList[1]}` },
        { isbn: `${isbnList[2]}` },
        { isbn: `${isbnList[5]}` },
      ]
    })
    expect(response.status).toBe(200)
  })

  test('удаление несуществующей книги из списка пользователя', async () => {
    const isbn = "123456789"
    const response = await deleteBook(isbn, userID, createdToken)

    expect(response.data).toMatchObject({
      code: '1206',                            // в контракте указан Number
      message: 'ISBN supplied is not available in User\'s Collection!'
    })
    expect(response.status).toBe(400)
  })

  test('удаление книги из списка пользователя без токена', async () => {
    const isbn = isbnList[1]
    const response = await deleteBook(isbn, userID, '')

    expect(response.data).toMatchObject({
      code: '1200',                            // в контракте указан Number
      message: 'User not authorized!'
    })
    expect(response.status).toBe(401)
  })

  test('удаление книги из списка пользователя', async () => {
    const isbn = isbnList[1]

    const response = await deleteBook(isbn, userID, createdToken)

    //expect(response.data).toMatchObject({
    //  userId: `${userID}`,
    //  isbn: isbnList[1],
    //  message: expect.any(String)
    // }) - не по контракту: response.data = '', нет тела ответа
    expect(response.status).toBe(204)
  })

  test('удаление всех книг пользователя без токена', async () => {
    const response = await deleteBooks(userID, '')

    expect(response.data).toMatchObject({
      code: '1200',                            // в контракте указан Number
      message: 'User not authorized!'
    })
    expect(response.status).toBe(401)
  })

  test('удаление всех книг пользователя', async () => {
    const response = await deleteBooks(userID, createdToken)

    //expect(response.data).toMatchObject({
    //  userId: `${userID}`,
    //  message: expect.any(String),
    //}) - не по контракту: response.data = '', нет тела ответа
    expect(response.status).toBe(204)
  })
})
