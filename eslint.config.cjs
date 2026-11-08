const stylistic = require('@stylistic/eslint-plugin');
const parser = require('@babel/eslint-parser');
const testingLibrary = require('eslint-plugin-testing-library');
const playwright = require('eslint-plugin-playwright');
const {classes} = require('./scripts/lint/classes.mjs');
const {structure} = require('./scripts/lint/structure.mjs');
const {bareInlineCode} = require('./scripts/lint/inline-code.mjs');
const {wrap} = require('./scripts/lint/wrap.mjs');
const {page} = require('./scripts/lint/page.mjs');

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
  '@stylistic/jsx-tag-spacing': ['error', {beforeSelfClosing: 'never', beforeClosing: 'never'}],
  'wrap/needless-wrap': 'error',
  '@stylistic/max-len': ['error', {
    code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true
  }]
};

const comparedToUndefined = {
  selector: 'BinaryExpression:matches([left.type="Identifier"][left.name="undefined"], [right.type="Identifier"][right.name="undefined"], [left.raw="null"], [right.raw="null"])',
  message: 'Say presence with has, empty, is, not or maybe from sand, never a comparison to null or undefined.'
};

const inlineAction = {
  selector: 'CallExpression[callee.name="dispatch"] > ObjectExpression.arguments',
  message: 'Dispatch what an action creator returns, as Feedback and UserInformation do, never an object written here.'
};

const childrenInProps = {
  selector: 'TSPropertySignature[key.name="children"]',
  message: 'Take children through PropsWithChildren<Props>, never as a key of the props type.'
};

const presence = {'no-restricted-syntax': ['error', comparedToUndefined, inlineAction, childrenInProps]};

const markup = {'no-restricted-syntax': ['error', comparedToUndefined, bareInlineCode, inlineAction, childrenInProps]};

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

const vanilla = ['src/pages/Demos/Tables/Frame/**', 'src/pages/Demos/Accordions/Plain/**'];

const stillReachForThePage = [
  'src/frame/navigation/arrival/useArrival.ts',
  'src/components/room.ts', 'src/frame/page/SideNav.tsx',
  'src/pages/Demos/ZIndexDemo/SortMenu.tsx'
];

const refsWithAReason = [
  'src/frame/notices/Feedback/Feedback.tsx', 'src/pages/Demos/Accordions/MeasuredPanel.tsx', 'src/pages/Demos/Controls/DialGroup.tsx'
];

module.exports = [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**', '.lighthouseci/**']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser,
      parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript']}},
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {'@stylistic': stylistic, wrap},
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
    plugins: {'@stylistic': stylistic, wrap},
    rules: {...shape, ...markup}
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
  },
  {
    files: ['e2e/**/*.ts'],
    ignores: ['e2e/looks/**', 'e2e/media/**', 'e2e/__test_support/journey.ts'],
    rules: {'no-restricted-imports': ['error', {paths: [{
      name: '@playwright/test',
      importNames: ['test'],
      message: 'a journey takes test from e2e/__test_support/journey.ts, which fails it on any page error'
    }]}]}
  },
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ignores: ['**/*.d.ts'],
    rules: {'no-restricted-exports': ['error', {
      restrictDefaultExports: {direct: true, named: true, defaultFrom: true, namedFrom: true, namespaceFrom: true}
    }]}
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/__tests__/**', '**/__test_support/**', 'src/entry.client.tsx', 'src/hydrateTheSite.tsx',
      'src/frame/state/env.ts', ...vanilla, ...stillReachForThePage],
    plugins: {page},
    rules: {'page/no-page-globals': 'error'}
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/__tests__/**', '**/__test_support/**'],
    rules: {'no-restricted-properties': ['error',
      {property: 'startViewTransition', message: 'motion is the style sheet\'s alone'},
      {property: 'animate', message: 'motion is the style sheet\'s alone'}
    ]}
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/__tests__/**', '**/__test_support/**', ...refsWithAReason],
    rules: {'no-restricted-imports': ['error', {paths: [{
      name: 'react',
      importNames: ['useRef', 'createRef', 'forwardRef'],
      message: 'a ref holds a dialog shown as a modal, or reads an element\'s details nothing else gives; list the file in refsWithAReason'
    }]}]}
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/__tests__/**', '**/__test_support/**', '**/*.d.ts'],
    plugins: {structure},
    rules: {
      'structure/one-export': 'error',
      'structure/has-index': 'error',
      'structure/through-index': 'error',
      'structure/index-top-level': 'error'
    }
  }
];
