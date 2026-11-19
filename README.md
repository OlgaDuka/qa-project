# qa-project

Учебный проект курса OTUS JavaScript QA Engineer: автотесты на Jest.

## Требования

- Node.js >= 22.18 (нужен для Allure CLI версии 3)
- Java не требуется: Allure Report 3 — Node.js-приложение

## Запуск тестов

```bash
npm install
npm test
```

`npm test` запускает Jest и сразу формирует:

- вывод в консоль (стандартный репортёр Jest);
- HTML-отчёт **jest-html-reporter** — `reports/jest-html-report.html` (открывается в браузере как обычная страница);
- сырые результаты для Allure — каталог `allure-results/`.

Перед запуском тестов каталог `allure-results/` автоматически очищается (`pretest`), чтобы в отчёт не попадали результаты предыдущих прогонов.

## HTML-отчёт jest-html-reporter

Репортёр подключён в `jest.config.js`:

```js
reporters: [
  'default', // обычный вывод в консоль
  [
    'jest-html-reporter',
    {
      pageTitle: 'Отчёт о тестировании QA-проекта',
      outputPath: 'reports/jest-html-report.html',
      includeFailureMsg: true, // текст ошибок упавших тестов
      includeSuiteFailure: true, // ошибки уровня describe/файла
      includeConsoleLog: true, // console.log из тестов
      includeStackTrace: true,
      sort: 'status', // сначала упавшие, затем пропущенные и пройденные
      theme: 'defaultTheme',
    },
  ],
],
```

Отчёт самодостаточный: один HTML-файл со встроенными стилями и скриптами, открывается двойным кликом, интернет не нужен.

## Отчёт Allure

Интеграция подключается через тестовое окружение `allure-jest` в `jest.config.js`:

```js
testEnvironment: 'allure-jest/node',
```

Jest пишет данные о тестах в `allure-results/`, а HTML-отчёт из них генерирует Allure CLI:

```bash
npm run allure:generate   # → каталог allure-report/ (index.html внутри)
npm run allure:open       # поднять локальный сервер и открыть отчёт в браузере
```

> Отчёт Allure нельзя открыть через `file://`: страница подгружает данные запросами, поэтому нужен веб-сервер — его и поднимает `npm run allure:open`.

## Скрипты

| Скрипт                  | Что делает                                                        |
| ----------------------- | ----------------------------------------------------------------- |
| `npm test`              | запуск Jest: консоль + HTML-отчёт + результаты для Allure         |
| `npm run allure:generate` | генерация статического HTML-отчёта Allure в `allure-report/`    |
| `npm run allure:open`   | запуск сервера и открытие отчёта Allure в браузере                |
| `npm run allure:clean`  | удаление `allure-results/` и `allure-report/`                     |
| `npm run lint`          | ESLint с автоисправлением                                         |
| `npm run lint:ci`       | ESLint без изменений файлов                                       |

## Структура

- `src/` — функции, которые тестируются юнит-тестами;
- `test/app.test.js` — юнит-тесты;
- `specs/` — API-тесты Bookstore (демо-стенд `bookstore.demoqa.com`);
- `framework/` — конфигурация, фикстуры и сервисы для API-тестов;
- `jest.config.js` — конфигурация Jest и репортёров.

## Известные падения

Часть API-тестов падает осознанно: реальные ответы стенда не совпадают с описанным контрактом (коды 400/404, тело ответа при ошибке авторизации). Подробности — в комментариях внутри `specs/*.spec.js`. В HTML-отчётах такие тесты видны как `failed` вместе с сообщениями проверок.
