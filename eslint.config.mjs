import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import jest from 'eslint-plugin-jest'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    // Сгенерированные отчёты и артефакты не проверяем
    ignores: ['coverage/**', 'reports/**', 'allure-results/**', 'allure-report/**', 'build/**', 'dist/**'],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  // Правила и парсер для TypeScript (.ts): см. https://typescript-eslint.io
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['test/**', 'specs/**'],
    ...jest.configs['flat/recommended'],
  }
)
