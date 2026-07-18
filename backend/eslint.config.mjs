import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['build', 'src/migrations/pre-release']
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    plugins: { '@stylistic': stylistic },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['src/tests/*']
        },
        tsconfigRootDir: import.meta.dirname
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