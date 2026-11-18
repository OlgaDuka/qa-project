/**
 * Позиция в корзине покупателя
 */
export interface CartItem {
  name?: string
  price: number
  quantity: number
}

/**
 * Студент и его баллы
 */
export interface Student {
  nik: string
  balls: number
}

/**
 * Проверка имени пользователя
 *
 * @param name проверяемое значение (может быть любым, функция сама проверяет тип)
 * @returns true, если значение — строка из двух и более латинских букв в нижнем регистре
 */
export const nameIsValid = (name: unknown): boolean =>
  typeof name === 'string' && name.length >= 2 && /^[a-z]+$/.test(name)

/**
 * Удаление пробелов из строки
 *
 * @param text исходная строка
 * @returns строка без пробелов
 */
export const fullTrim = (text?: string | null): string => (text ?? '').replace(/\s+/g, '')

/**
 * Подсчёт суммы заказа
 *
 * @param items товары в заказе
 * @param discount размер скидки в процентах
 * @returns сумма заказа с учётом скидки
 * @throws Вернёт ошибку, если скидка не число и больше 99 или меньше 0
 * @example getTotal([{ price: 10, quantity: 10 }]) // 100
 * @example getTotal([{ price: 10, quantity: 1 }]) // 10
 * @example getTotal([{ price: 10, quantity: 1 }, { price: 10, quantity: 9 }]) // 100
 * @example getTotal([{ price: 10, quantity: 0 }], { price: 10, quantity: 9 }) // 90
 * @example getTotal([{ price: 10, quantity: 10 }], 10) // 90
 * @example getTotal([{ price: 10, quantity: 10 }], 100) // 0
 */
export const getTotal = (items: CartItem[] = [], discount: number = 0): number => {
  if (typeof discount !== 'number') {
    throw new Error('Скидка должна быть числом')
  }
  if (discount < 0 || discount >= 100) {
    throw new Error('Процент скидки должен быть от 0 до 99')
  }

  const total = items.reduce((acc, { price, quantity }) => acc + price * quantity, 0)
  return total * (1 - discount / 100)
}

/**
 * Подсчёт успеваемости группы студентов, вариант 1
 * Жесткий вариант функции, если входные данные из внешних источников
 *
 * @param students данные студентов (проверяются во время выполнения)
 * @returns сумма баллов
 * @throws Вернёт ошибку, если аргумент не массив или массив пустой
 * @throws Вернёт ошибку, если какой-либо из элементов массива не объект
 * @throws Вернёт ошибку, если в каком-либо объекте (элементе массива) свойство balls не число
 * @example getScore([{ nik: 'Olga', balls: 10 }, { nik: 'Masha', balls: 15 }]) // 25
 */
export const getScore = (students: unknown = []): number => {
  if (!Array.isArray(students)) {
    throw new TypeError('Аргумент функции должен быть массивом')
  }

  if (students.length === 0) {
    throw new Error('Входной массив не должен быть пустым')
  }

  let total = 0
  const list: unknown[] = students

  for (const student of list) {
    if (typeof student !== 'object' || student === null) {
      throw new TypeError('Каждый элемент массива должен быть объектом')
    }

    const { nik, balls } = student as Partial<Student>

    if (typeof balls !== 'number') {
      throw new TypeError(`У студента ${nik} свойство balls имеет тип ${typeof balls}, а не number`)
    }

    total += balls
  }

  return total
}

/**
 * Подсчёт успеваемости группы студентов, вариант 2
 * Вариант функции для внутренних расчетов: если какой-либо из элементов массива не объект или
 * в каком-либо объекте свойство balls не число, просто заменяем значение на 0
 *
 * @param students данные студентов (проверяются во время выполнения)
 * @returns сумма баллов
 * @throws Вернёт ошибку, если аргумент не массив или массив пуст.
 * @example getScore2([{ nik: 'Olga', balls: 10 }, { nik: 'Masha', balls: 15 }]) // 25
 */
export const getScore2 = (students: unknown = []): number => {
  if (!Array.isArray(students)) {
    throw new TypeError('Аргумент функции должен быть массивом')
  }

  if (students.length === 0) {
    throw new Error('Входной массив не должен быть пустым')
  }

  let total = 0
  const list: unknown[] = students

  for (const student of list) {
    const balls = typeof student === 'object' && student !== null ? (student as Partial<Student>).balls : undefined
    total += typeof balls === 'number' ? balls : 0
  }

  return total
}
