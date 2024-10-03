module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
