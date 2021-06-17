module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    // We will use TypeScript's types for component props instead
    'react/prop-types': 'off',
    'react/display-name': 'off',

    // No need to import React when using Next.js
    'react/react-in-jsx-scope': 'off',

    // Why would you want unused vars?
    '@typescript-eslint/no-unused-vars': ['warn'],

    // I suggest this setting for requiring return types on functions only where useful
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
  },
  parser: 'babel-eslint',
  parserOptions: { ecmaVersion: 8, sourceType: 'module' }, // to enable features such as async/await
  ignorePatterns: [
    'node_modules/*',
    '**/node_modules/*',
    '.next/*',
    '.out/*',
    'public/data/**',
    '!.prettierrc.js',
  ], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ['eslint:recommended'],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:prettier/recommended',
      ],
      rules: {
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        // We will use TypeScript's types for component props instead
        'react/prop-types': 'off',
        'react/display-name': 'off',

        // No need to import React when using Next.js
        'react/react-in-jsx-scope': 'off',

        // Why would you want unused vars?
        '@typescript-eslint/no-unused-vars': ['warn'],

        // I suggest this setting for requiring return types on functions only where useful
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
      },
    },
  ],
};
