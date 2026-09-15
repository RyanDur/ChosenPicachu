import stylistic from '@stylistic/eslint-plugin';
import parser from '@babel/eslint-parser';

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

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**', '.lighthouseci/**']
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
  }
];
