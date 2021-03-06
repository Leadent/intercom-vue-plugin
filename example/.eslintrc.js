module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  globals: {
    expect: true,
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    '@vue/prettier',
  ],
  plugins: ['vue'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 'off',
  },
};
