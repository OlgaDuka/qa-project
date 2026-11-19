module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // Удаляет типы TypeScript: babel-jest транспилирует .ts в CommonJS, поэтому тесты
    // запускаются без отдельного шага компиляции (типы проверяет `npm run type-check`)
    ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
  ],
}
