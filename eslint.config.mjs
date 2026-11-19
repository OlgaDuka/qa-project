import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import jest from 'eslint-plugin-jest'

export default [
  {
    // Сгенерированные отчёты и артефакты не проверяем
    ignores: ['coverage/**', 'reports/**', 'allure-results/**', 'allure-report/**', 'build/**'],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['test/**', 'specs/**'],
    ...jest.configs['flat/recommended'],
  },
]
