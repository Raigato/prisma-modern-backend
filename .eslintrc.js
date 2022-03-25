module.exports = {
  plugins: ['@typescript-eslint', 'unused-imports', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
  env: {
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
}
