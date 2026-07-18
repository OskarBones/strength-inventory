import eslintReact from '@eslint-react/eslint-plugin';
import eslintJs from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import reactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import { reactRefresh } from 'eslint-plugin-react-refresh';

export default defineConfig(
  {
    ignores: ['dist', 'src/routeTree.gen.ts']
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      eslintReact.configs['recommended-typescript'],
      pluginQuery.configs['flat/recommended'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
    ],
    plugins: { '@stylistic': stylistic },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      'sort-imports': ['error', { 'ignoreCase': true, 'allowSeparatedGroups': true }],
      '@stylistic/array-bracket-newline': ['error', { 'multiline': true, 'minItems': 4 }],
      '@stylistic/array-bracket-spacing': ['error'],
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/arrow-parens': ['error'],
      '@stylistic/arrow-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/block-spacing': ['error'],
      '@stylistic/brace-style': ['error'],
      '@stylistic/comma-dangle': ['error'],
      '@stylistic/comma-spacing': ['error'],
      '@stylistic/comma-style': ['error'],
      '@stylistic/computed-property-spacing': ['error'],
      '@stylistic/eol-last': ['error'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-call-spacing': ['error'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
      '@stylistic/generator-star-spacing': ['error'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/jsx-child-element-spacing': ['error'],
      '@stylistic/jsx-closing-bracket-location': ['error'],
      '@stylistic/jsx-closing-tag-location': ['error'],
      '@stylistic/jsx-curly-brace-presence': ['error', { 'props': 'never', 'children': 'never', 'propElementValues': 'always' }],
      '@stylistic/jsx-curly-newline': ['error'],
      '@stylistic/jsx-curly-spacing': ['error'],
      '@stylistic/jsx-equals-spacing': ['error'],
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      '@stylistic/jsx-function-call-newline': ['error'],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-pascal-case': ['error'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/jsx-self-closing-comp': ['error'],
      '@stylistic/jsx-tag-spacing': ['error', { 'beforeClosing': 'proportional-always' }],
      '@stylistic/jsx-wrap-multilines': ['error', {
        "declaration": "parens-new-line",
        "assignment": "parens-new-line",
        "return": "parens-new-line",
        "arrow": "parens-new-line",
        "condition": "parens-new-line",
        "logical": "parens-new-line",
        "prop": "parens-new-line",
        "propertyValue": "parens-new-line"
      }],
      '@stylistic/key-spacing': ['error'],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/lines-between-class-members': ['error'],
      '@stylistic/max-len': ['error', { 'tabWidth': 2 }],
      '@stylistic/max-statements-per-line': ['error'],
      '@stylistic/multiline-ternary': ['error'],
      '@stylistic/new-parens': ['error'],
      '@stylistic/newline-per-chained-call': ['error'],
      '@stylistic/no-confusing-arrow': ['error'],
      '@stylistic/no-extra-parens': ['error', 'functions'],
      '@stylistic/no-extra-semi': ['error'],
      '@stylistic/no-floating-decimal': ['error'],
      '@stylistic/no-mixed-operators': ['error'],
      '@stylistic/no-mixed-spaces-and-tabs': ['error'],
      '@stylistic/no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
      '@stylistic/no-multiple-empty-lines': ['error'],
      '@stylistic/no-tabs': ['error', { 'allowIndentationTabs': true }],
      '@stylistic/no-trailing-spaces': ['error'],
      '@stylistic/no-whitespace-before-property': ['error'],
      '@stylistic/nonblock-statement-body-position': ['error'],
      '@stylistic/object-curly-newline': ['error', { 'consistent': true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/rest-spread-spacing': ['error'],
      '@stylistic/semi': ['error'],
      '@stylistic/semi-spacing': ['error'],
      '@stylistic/semi-style': ['error'],
      '@stylistic/space-before-blocks': ['error'],
      '@stylistic/space-before-function-paren': ['error'],
      '@stylistic/space-in-parens': ['error'],
      '@stylistic/space-infix-ops': ['error'],
      '@stylistic/space-unary-ops': ['error'],
      '@stylistic/spaced-comment': ['error'],
      '@stylistic/switch-colon-spacing': ['error'],
      '@stylistic/template-curly-spacing': ['error'],
      '@stylistic/template-tag-spacing': ['error'],
      '@stylistic/type-annotation-spacing': ['error'],
      '@stylistic/type-generic-spacing': ['error'],
      '@stylistic/type-named-tuple-spacing': ['error'],
      '@stylistic/yield-star-spacing': ['error', 'before']
    }
  } 
);
