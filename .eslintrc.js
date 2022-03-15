'use strict';

module.exports = {
  env: {
    node: true,
  },
  ignorePatterns: ['**/*.js'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.test.ts'],
      rules: { '@typescript-eslint/no-explicit-any': 0 },
    },
  ],
};
