/**
 * Локальные типы для пакетов без собственных деклараций.
 *
 * `jest-json-schema` поставляется без типов, поэтому здесь описаны:
 *  - экспорт модуля (`matchers`);
 *  - дополнительные матчеры `expect(...)`, которые он добавляет в Jest.
 */
declare module 'jest-json-schema' {
  /** Готовый набор матчеров для проверки JSON-схем (на основе ajv) */
  export const matchers: jest.ExpectExtendMap

  /** Создаёт набор матчеров с собственными настройками ajv */
  export function matchersWithOptions(
    options?: Record<string, unknown>,
    extendAjv?: (ajv: unknown) => void
  ): jest.ExpectExtendMap
}

declare namespace jest {
  // Параметры должны совпадать с объявлением в @types/jest, иначе интерфейсы не сольются,
  // поэтому параметр T объявлен, хотя в новых матчерах не используется
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
  interface Matchers<R, T = {}> {
    /** Проверяет, что значение соответствует JSON-схеме */
    toMatchSchema(schema: import('ajv').AnySchema): R

    /** Проверяет, что значение является валидной JSON-схемой */
    toBeValidSchema(schema: import('ajv').AnySchema): R
  }
}
