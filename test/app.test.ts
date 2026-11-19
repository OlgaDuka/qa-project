import { nameIsValid, getTotal, fullTrim, getScore, getScore2 } from '../src/app'
import type { CartItem, Student } from '../src/app'

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
    expect(fullTrim('hello world')).toBe('helloworld')
  })

  it('удаляет множественные пробелы в любом месте строки', () => {
    expect(fullTrim('hello   world')).toBe('helloworld')
    expect(fullTrim('  hello world  ')).toBe('helloworld')
  })

  it('возвращает пустую строку для null/undefined', () => {
    expect(fullTrim(null)).toBe('')
    expect(fullTrim(undefined)).toBe('')
  })
})

describe('getTotal', () => {
  type ValidTotalCase = {
    name: string
    buys: CartItem[]
    discount: number
    expected: number
  }

  const validData: ValidTotalCase[] = [
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

  type InvalidTotalCase = {
    name: string
    buys: CartItem[]
    discount: number | null
    error: string
  }

  const invalidData: InvalidTotalCase[] = [
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
    // Значение заведомо неверного типа передаём намеренно: проверяем валидацию во время выполнения
    expect(() => getTotal(buys, discount as number)).toThrow(error)
  })
})

describe('getScore', () => {
  const students: Student[] = [
    { nik: 'Olga', balls: 10 },
    { nik: 'Masha', balls: 15 },
    { nik: 'Misha', balls: 4 },
    { nik: 'Ivan', balls: 12 },
    { nik: 'Tima', balls: 8 },
    { nik: 'Pavel', balls: 18 },
    { nik: 'Rostik', balls: 8 },
  ]

  it('данные верны', () => {
    const result = getScore(students)
    expect(result).toEqual(75)
  })

  type InvalidStudentsCase = {
    name: string
    students: unknown
    error: string | RegExp
  }

  const invalidData: InvalidStudentsCase[] = [
    {
      name: 'Входные данные не массив',
      students: 25,
      error: 'Аргумент функции должен быть массивом',
    },
    {
      name: 'Входной массив пуст',
      students: [],
      error: 'Входной массив не должен быть пустым',
    },
    {
      name: 'Элемент массива не объект',
      students: [{ nik: 'Olga', balls: 10 }, { nik: 'Masha', balls: 15 }, 4],
      error: 'Каждый элемент массива должен быть объектом',
    },
    {
      name: 'Свойство balls не число',
      students: [
        { nik: 'Olga', balls: 10 },
        { nik: 'Masha', balls: '15 баллов' },
        { nik: 'Misha', balls: 4 },
      ],
      error: /У студента .* свойство balls имеет тип .*, а не number/,
    },
  ]

  it.each(invalidData)('%s', ({ students, error }) => {
    expect(() => getScore(students)).toThrow(error)
  })

  // Дополнительный тест на определение невалидного типа свойства balls
  const balls_types: Array<{ name: string; value: unknown }> = [
    { name: 'string', value: '15 баллов' },
    { name: 'boolean', value: true },
    { name: 'null', value: null },
    { name: 'object', value: {} },
    { name: 'undefined', value: undefined },
  ]

  it.each(balls_types)('Свойство balls имеет тип %s', ({ name, value }) => {
    const students = [
      { nik: 'Olga', balls: 10 },
      { nik: 'Masha', balls: value },
      { nik: 'Misha', balls: 4 },
    ]
    // Можно оставить только строку ниже
    // expect(() => getScore(students)).toThrow(/У студента .* свойство balls имеет тип .*, а не number/)
    // Но для отладки теста интересно получить сообщение в консоль:

    let error: Error | undefined
    try {
      getScore(students)
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e))
    }

    expect(error).toBeDefined()
    expect(error?.message).toMatch(/У студента .* свойство balls имеет тип .*, а не number/)
    console.log(`тип ${name}: ${error?.message}`)
  })
})

describe('getScore2', () => {
  const students_example: Student[] = [
    { nik: 'Olga', balls: 10 },
    { nik: 'Masha', balls: 15 },
    { nik: 'Misha', balls: 4 },
    { nik: 'Ivan', balls: 12 },
    { nik: 'Tima', balls: 8 },
    { nik: 'Pavel', balls: 18 },
    { nik: 'Rostik', balls: 8 },
  ]

  type ValidScore2Case = {
    name: string
    students: unknown
    expected: number
  }

  const validData: ValidScore2Case[] = [
    {
      name: 'Данные верны',
      students: students_example,
      expected: 75,
    },
    {
      name: 'В данных есть не объект',
      students: [{ nik: 'Olga', balls: 10 }, { nik: 'Masha', balls: 15 }, 4],
      expected: 25,
    },
    {
      name: 'В данных есть свойство balls строка',
      students: [
        { nik: 'Olga', balls: 10 },
        { nik: 'Masha', balls: '15 баллов' },
        { nik: 'Misha', balls: 4 },
      ],
      expected: 14,
    },
  ]

  it.each(validData)('%s', ({ students, expected }) => {
    const result = getScore2(students)
    expect(result).toEqual(expected)
  })

  type InvalidScore2Case = {
    name: string
    students: unknown
    error: string
  }

  const invalidData: InvalidScore2Case[] = [
    {
      name: 'Входные данные не массив',
      students: 25,
      error: 'Аргумент функции должен быть массивом',
    },
    {
      name: 'Входной массив пуст',
      students: [],
      error: 'Входной массив не должен быть пустым',
    },
  ]

  it.each(invalidData)('%s', ({ students, error }) => {
    expect(() => getScore2(students)).toThrow(error)
  })
})
