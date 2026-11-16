/**
 * Конфигурация Jest.
 * Полный список опций: https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Автоматически очищать мок-функции перед каждым тестом
  clearMocks: true,

  // Собирать покрытие кода при каждом запуске тестов
  collectCoverage: true,

  // Каталог для файлов покрытия
  coverageDirectory: 'coverage',

  // Провайдер инструментирования кода для покрытия
  coverageProvider: 'v8',

  // Окружение Allure: собирает данные о тестах в каталог allure-results
  testEnvironment: 'allure-jest/node',

  // Транспиляция ESM/TS через Babel
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },

  // @faker-js/faker поставляется как ESM, поэтому его нужно трансформировать
  transformIgnorePatterns: ['/node_modules/(?!(.*@faker-js.*))'],

  // Репортёры: обычный вывод в консоль + HTML-отчёт.
  // Без явного "default" Jest заменил бы стандартный репортёр на кастомные.
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Отчёт о тестировании QA-проекта',
        outputPath: 'reports/jest-html-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
        includeConsoleLog: true,
        includeStackTrace: true,
        sort: 'status',
        theme: 'defaultTheme',
      },
    ],
  ],
}

module.exports = config
