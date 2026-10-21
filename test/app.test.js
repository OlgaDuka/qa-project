import { nameIsValid, getTotal, fullTrim } from '../src/app.js'

describe('nameIsValid', () => {
  it('возвращает true для валидного имени', () => {
    expect(nameIsValid('olga')).toBe(true)
    expect(nameIsValid('timur')).toBe(true)
  })

  it('возвращает false, если имя не строка', () => {
    expect(nameIsValid(123)).toBe(false)
    expect(nameIsValid(null)).toBe(false)
    expect(nameIsValid(undefined)).toBe(false)
    expect(nameIsValid({})).toBe(false)
  })

  it('возвращает false для имени длиной менее 2 символов', () => {
    expect(nameIsValid('a')).toBe(false)
  })

  it('возвращает false для пустой строки', () => {
    expect(nameIsValid('')).toBe(false)
  })

  it('возвращает false, если в имени есть цифры или спецсимволы', () => {
    expect(nameIsValid('olga1')).toBe(false)
    expect(nameIsValid('timur_free')).toBe(false)
  })

  it('возвращает false, если в имени есть пробелы', () => {
    expect(nameIsValid('olga duka')).toBe(false)
  })

  it('возвращает false для имени с кириллицей', () => {
    expect(nameIsValid('ольга')).toBe(false)
  })

  it('возвращает false для имени с заглавными буквами', () => {
    expect(nameIsValid('Olga')).toBe(false)
    expect(nameIsValid('OLGA')).toBe(false)
  })
})

describe('fullTrim', () => {
  it('возвращает строку без пробелов', () => {
    expect(fullTrim('Осень краски разводила в капельках дождя')).toBe('Осенькраскиразводилавкапелькахдождя')
  })
})

describe('getTotal', () => {
  const validData = [
    {
      name: 'без дисконта',
      buys: [{ quantity: 10, name: 'product1', price: 10 }],
      discount: 0,
      expected: 100,
    },
    {
      name: 'дисконт 10%',
      buys: [
        { quantity: 1, name: 'product2', price: 10 },
        { quantity: 9, name: 'product3', price: 10 },
      ],
      discount: 10,
      expected: 90,
    },
  ]

  it.each(validData)('%s', ({ buys, discount, expected }) => {
    const result = getTotal(buys, discount)
    expect(result).toEqual(expected)
  })

  const invalidData = [
    {
      name: 'дисконт не является числом',
      buys: [{ quantity: 10, name: 'product4', price: 10 }],
      discount: null,
      error: 'Скидка должна быть числом',
    },
    {
      name: 'дисконт отрицательное число',
      buys: [
        { quantity: 1, name: 'product5', price: 10 },
        { quantity: 9, name: 'product6', price: 10 },
      ],
      discount: -5,
      error: 'Процент скидки должен быть от 0 до 99',
    },
  ]

  it.each(invalidData)('%s', ({ buys, discount, error }) => {
    expect(() => getTotal(buys, discount)).toThrow(error)
  })
})
