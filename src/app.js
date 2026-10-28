/**
 * Проверка имени пользователя
 * @param {string} name
 * @returns {boolean}
 */
export const nameIsValid = (name) => typeof name === 'string' && name.length >= 2 && /^[a-z]+$/.test(name)

/**
 * Удаление пробелов из строки
 *
 * @param {string} text
 * @returns {string}
 */
export const fullTrim = (text) => (text ?? '').replace(/\s+/g, '')

/**
 * Подсчёт суммы заказа
 *
 * @param {[{quantity: number, name?: string, price: number}]} items
 * @param {number} discount
 * @returns {number}
 * @throws Вернёт ошибку, если скидка не число и больше 99 или меньше 0
 * @example getTotal([{ price: 10, quantity: 10 }]) // 100
 * @example getTotal([{ price: 10, quantity: 1 }]) // 10
 * @example getTotal([{ price: 10, quantity: 1 }, { price: 10, quantity: 9 }]) // 100
 * @example getTotal([{ price: 10, quantity: 0 }], { price: 10, quantity: 9 }) // 90
 * @example getTotal([{ price: 10, quantity: 10 }], 10) // 90
 * @example getTotal([{ price: 10, quantity: 10 }], 100) // 0
 */
export const getTotal = (items = [], discount = 0) => {
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
 * Жесткий вариант функции, если входные данные их внешних источников
 *
 * @param {[{nik: string, balls: number}]} students
 * @returns {number}
 * @throws Вернёт ошибку, если аргумент не массив или массив пустой
 * @throws Вернёт ошибку, если какой-либо из элементов массива не объект
 * @throws Вернёт ошибку, если в каком-либо объекте (элементе массива) свойство balls не число
 * @example getScore([{ nik: 'Olga', balls: 10 }, { nik: 'Masha', balls: 15 }]) // 25
 */

export const getScore = (students = []) => {
  if (!Array.isArray(students)) {
    throw new TypeError('Аргумент функции должен быть массивом')
  }

  if (students.length === 0) {
    throw new Error('Входной массив не должен быть пустым')
  }

  return students.reduce((acc, student) => {
    if (typeof student !== 'object' || student === null) {
      throw new TypeError('Каждый элемент массива должен быть объектом')
    }
    if (typeof student.balls !== 'number') {
      throw new TypeError(`У студента ${student.nik} свойство balls имеет тип ${typeof student.balls}, а не number`)
    }
    return acc + student.balls
  }, 0)
}

/**
 * Подсчёт успеваемости группы студентов, вариант 2
 * Вариант функции для внутренних расчетов: если какой-либо из элементов массива не объект или
 * в каком-либо объекте свойство balls не число, просто заменяем значение на 0
 *
 * @param {[{nik: string, balls: number}]} students
 * @returns {number}
 * @throws Вернёт ошибку, если аргумент не массив или массив пуст.
 * @example getScore2([{ nik: 'Olga', balls: 10 }, { nik: 'Masha', balls: 15 }]) // 25
 */

export const getScore2 = (students = []) => {
  if (!Array.isArray(students)) {
    throw new TypeError('Аргумент функции должен быть массивом')
  }

  if (students.length === 0) {
    throw new Error('Входной массив не должен быть пустым')
  }

  return students.reduce((acc, student) => {
    return acc + (typeof student?.balls === 'number' ? student.balls : 0)
  }, 0)
}
