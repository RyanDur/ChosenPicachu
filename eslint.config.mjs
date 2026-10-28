import stylistic from '@stylistic/eslint-plugin';
import parser from '@babel/eslint-parser';
import testingLibrary from 'eslint-plugin-testing-library';
import playwright from 'eslint-plugin-playwright';
import classes from './scripts/lint/classes.mjs';

const shape = {
  '@stylistic/indent': ['error', 2, {SwitchCase: 1}],
  '@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
  '@stylistic/jsx-quotes': ['error', 'prefer-double'],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/comma-dangle': ['error', {arrays: 'never', objects: 'never', imports: 'never', exports: 'never', functions: 'never', enums: 'never', tuples: 'never', generics: 'ignore'}],
  '@stylistic/object-curly-spacing': ['error', 'never'],
  '@stylistic/array-bracket-spacing': ['error', 'never'],
  '@stylistic/arrow-parens': ['error', 'as-needed'],
  '@stylistic/arrow-spacing': 'error',
  '@stylistic/brace-style': ['error', '1tbs', {allowSingleLine: true}],
  '@stylistic/comma-spacing': 'error',
  '@stylistic/key-spacing': 'error',
  '@stylistic/keyword-spacing': 'error',
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/space-before-blocks': 'error',
  '@stylistic/space-before-function-paren': ['error', {anonymous: 'always', named: 'never', asyncArrow: 'always'}],
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': ['error', {max: 1, maxEOF: 0}],
  '@stylistic/eol-last': 'error',
  '@stylistic/member-delimiter-style': 'error',
  '@stylistic/type-annotation-spacing': 'error',
  '@stylistic/jsx-curly-spacing': ['error', {when: 'never'}],
  '@stylistic/jsx-equals-spacing': ['error', 'never'],
  '@stylistic/jsx-tag-spacing': ['error', {beforeSelfClosing: 'never', beforeClosing: 'never'}]
};

const presence = {
  'no-restricted-syntax': ['error', {
    selector: 'BinaryExpression:matches([left.type="Identifier"][left.name="undefined"], [right.type="Identifier"][right.name="undefined"])',
    message: 'Say presence with truthiness, ?? or maybe, not a comparison to undefined.'
  }]
};

const specs = Object.fromEntries([
  'await-async-events', 'await-async-queries', 'await-async-utils', 'no-await-sync-events', 'no-await-sync-queries',
  'no-container', 'no-debugging-utils', 'no-dom-import', 'no-global-regexp-flag-in-query', 'no-manual-cleanup',
  'no-promise-in-fire-event', 'no-test-id-queries', 'no-unnecessary-act', 'no-wait-for-multiple-assertions',
  'no-wait-for-side-effects', 'no-wait-for-snapshot', 'prefer-find-by', 'prefer-presence-queries',
  'prefer-query-by-disappearance', 'render-result-naming-convention'
].map(rule => [`testing-library/${rule}`, 'error']));

const journeys = Object.fromEntries([
  'missing-playwright-await', 'no-commented-out-tests', 'no-duplicate-hooks', 'no-element-handle', 'no-eval',
  'no-focused-test', 'no-networkidle', 'no-page-pause', 'no-raw-locators', 'no-standalone-expect', 'no-unsafe-references',
  'no-unused-locators', 'no-useless-await', 'no-useless-not', 'no-wait-for-navigation', 'no-wait-for-selector',
  'no-wait-for-timeout', 'prefer-native-locators', 'prefer-web-first-assertions', 'require-annotation-reason',
  'valid-describe-callback', 'valid-expect', 'valid-expect-in-promise'
].map(rule => [`playwright/${rule}`, 'error']));

export default [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**', '.lighthouseci/**']
  },
  {
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
      parser,
      parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript']}},
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {'@stylistic': stylistic},
    rules: {...shape, ...presence}
  },
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-syntax-jsx']}
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {'@stylistic': stylistic},
    rules: {...shape, ...presence}
  },
  {
    files: ['src/**/*.{ts,tsx}', 'src/**/*.html/*.htmlclasses'],
    plugins: {classes},
    rules: {'classes/class-defined': 'error', 'classes/own-class-first': 'error'}
  },
  {
    files: ['src/**/*.html'],
    plugins: {classes},
    processor: 'classes/html'
  },
  {
    files: ['src/**/__tests__/**/*.{ts,tsx}', 'src/**/__test_support/**/*.{ts,tsx}'],
    plugins: {'testing-library': testingLibrary},
    rules: specs
  },
  {
    files: ['src/**/__test_support/**/*.{ts,tsx}'],
    plugins: {'testing-library': testingLibrary},
    rules: {'testing-library/prefer-screen-queries': 'error'}
  },
  {
    files: ['e2e/**/*.ts'],
    ignores: ['e2e/looks/**', 'e2e/media/**'],
    plugins: {playwright},
    rules: {...journeys, 'playwright/no-skipped-test': ['error', {allowConditional: true}]}
  }
];
