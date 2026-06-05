// File: eslint.config.js
module.exports = {
  root: true,
  extends: [
    'eslint:recommended'
  ],
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
};
