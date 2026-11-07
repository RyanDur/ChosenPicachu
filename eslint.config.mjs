import stylistic from '@stylistic/eslint-plugin';
import parser from '@babel/eslint-parser';
import testingLibrary from 'eslint-plugin-testing-library';
import playwright from 'eslint-plugin-playwright';
import {classes} from './scripts/lint/classes.mjs';
import {structure} from './scripts/lint/structure.mjs';
import {bareInlineCode} from './scripts/lint/inline-code.mjs';
import {wrap} from './scripts/lint/wrap.mjs';

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
  selector: 'BinaryExpression:matches([left.type="Identifier"][left.name="undefined"], [right.type="Identifier"][right.name="undefined"])',
  message: 'Say presence with truthiness, ?? or maybe, not a comparison to undefined.'
};

const inlineAction = {
  selector: 'CallExpression[callee.name="dispatch"] > ObjectExpression.arguments',
  message: 'Dispatch what an action creator returns, as Feedback and UserInformation do, never an object written here.'
};

const presence = {'no-restricted-syntax': ['error', comparedToUndefined, inlineAction]};

const markup = {'no-restricted-syntax': ['error', comparedToUndefined, bareInlineCode, inlineAction]};

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

const routeModules = [
  'Demos/Accordions/tab.tsx', 'Demos/ZIndexDemo/tab.tsx', 'Demos/DragAndDrop/tab.tsx', 'Demos/Charts/tab.tsx',
  'Demos/Tables/tab.tsx', 'Home/route.tsx', 'Demos/SavedTab/route.tsx', 'Demos/route.tsx', 'Demos/Charts/route.tsx',
  'Users/route.tsx', 'Gallery/route.tsx', 'Gallery/Piece/route.tsx', 'Games/route.tsx', 'Record/route.tsx',
  'Practice/SavedTab/route.tsx', 'Practice/route.tsx', 'NoRoom/route.tsx'
].map(path => `src/pages/${path}`);

const vanilla = ['src/pages/Demos/Tables/Frame/**', 'src/pages/Demos/Accordions/Plain/**'];

const stillReachForThePage = [
  'src/components/Banners/Banners.tsx', 'src/components/Feedback/Feedback.tsx',
  'src/components/OpeningFragment/useArrival.ts', 'src/components/Users/FriendsList/FriendsList.tsx',
  'src/components/glide.ts', 'src/components/room.ts', 'src/components/scroll/scroll.ts', 'src/pages/BasePage/SideNav.tsx',
  'src/pages/Demos/Charts/Workspace.tsx',
  'src/pages/Demos/Tables/Aggregations/fold.ts', 'src/pages/Demos/ZIndexDemo/BannerTrap.tsx',
  'src/pages/Demos/ZIndexDemo/SortMenu.tsx', 'src/pages/Users/UsersTable/UserMenu/UserMenu.tsx'
];

const refsWithAReason = [
  'src/pages/Demos/Accordions/MeasuredPanel.tsx', 'src/pages/Demos/Controls/DialGroup.tsx'
];

const stillMoveByScript = ['src/components/glide.ts'];

export default [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**', '.lighthouseci/**', '.react-router/**']
  },
  {
    files: ['**/*.{js,mjs,ts}'],
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
    ignores: ['src/root.tsx', 'src/routes.ts', ...routeModules, '*.config.{js,mjs,ts}', '**/*.d.ts'],
    rules: {'no-restricted-exports': ['error', {
      restrictDefaultExports: {direct: true, named: true, defaultFrom: true, namedFrom: true, namespaceFrom: true}
    }]}
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/__tests__/**', '**/__test_support/**', 'src/entry.client.tsx', 'src/env.ts', ...vanilla, ...stillReachForThePage],
    rules: {'no-restricted-globals': ['error',
      {name: 'document', message: 'React code never reaches for the document; a vanilla build lives in its own directory'},
      {name: 'window', message: 'React code never reaches for the window; a vanilla build lives in its own directory'}
    ]}
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/__tests__/**', '**/__test_support/**', ...stillMoveByScript],
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
