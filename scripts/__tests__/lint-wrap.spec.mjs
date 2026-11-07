import {RuleTester} from 'eslint';
import parser from '@babel/eslint-parser';
import {wrap} from '../lint/wrap.mjs';

const tester = new RuleTester({languageOptions: {
  parser,
  parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript']}}
}});

tester.run('needless-wrap', wrap.rules['needless-wrap'], {
  valid: [
    {name: 'should accept a value on the line of its name', code: 'const {pace, origin} = useControls();'},
    {name: 'should accept a wrap the value needs to stay under the limit', code: `const value =\n  ${'a'.repeat(110)};`},
    {name: 'should accept a value that runs over several lines', code: 'const value =\n  call(\n    one\n  );'},
    {name: 'should accept a wrap with a comment after the operator', code: 'const value = // why\n  1;'},
    {name: 'should not read an assignment on the next line as this one\'s', code: 'let edge = 0;\nedge += size;'}
  ],
  invalid: [
    {
      name: 'should join a value that fits after the change that shortened it',
      code: 'const {pace, origin, motion} =\n  useControls();',
      output: 'const {pace, origin, motion} = useControls();',
      errors: [{messageId: 'fits'}]
    },
    {
      name: 'should join a wrapped assignment that fits',
      code: 'total +=\n  size;',
      output: 'total += size;',
      errors: [{messageId: 'fits'}]
    }
  ]
});
