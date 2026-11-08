import {RuleTester} from 'eslint';
import parser from '@babel/eslint-parser';
import {join} from 'node:path';
import {structure} from '../lint/structure.mjs';

const at = path => join(process.cwd(), path);
const withIndex = at('src/banners/Probe.ts');
const withoutIndex = at('src/components/NoSuchDirectory/Probe.ts');
const listedForOneExport = at('src/banners/Probe.ts');
const ownList = {exceptions: {'one-export': ['src/banners/Probe.ts']}};
const home = at('src/pages/Home/Probe.tsx');

const tester = new RuleTester({languageOptions: {
  parser,
  parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-syntax-jsx']}}
}});

tester.run('one-export', structure.rules['one-export'], {
  valid: [
    {name: 'should accept one module function', code: 'export const banners = () => ({});', filename: withIndex},
    {name: 'should accept a module function and its types', code: 'export const banners = () => ({}); export type Side = string;', filename: withIndex}
  ],
  invalid: [
    {name: 'should refuse a second exported value', code: 'export const one = 1; export const two = 2;', filename: withIndex, errors: 1},
    {name: 'should ask a listed file that now keeps the rule to come off the list', code: 'export const probe = {};', filename: listedForOneExport, options: [ownList], errors: [{messageId: 'mended'}]}
  ]
});

tester.run('has-index', structure.rules['has-index'], {
  valid: [
    {name: 'should accept a file in a directory with an index', code: 'export const x = 1;', filename: withIndex},
    {name: 'should ask no index beside a route module', code: 'export default () => null;', filename: at('src/pages/Demos/SavedTab/route.tsx')}
  ],
  invalid: [{name: 'should refuse a file in a directory with no index', code: 'export const x = 1;', filename: withoutIndex, errors: 1}]
});

tester.run('through-index', structure.rules['through-index'], {
  valid: [
    {name: 'should accept an import of the directory', code: "import {Banners} from '@banners';", filename: home},
    {name: 'should accept an import of a file from inside its own directory', code: "import {sideParam} from './params';", filename: withIndex}
  ],
  invalid: [
    {name: 'should refuse an import past another directory\'s index', code: "import {Banners} from '@banners/Banners';", filename: home, errors: 1}
  ]
});

tester.run('index-top-level', structure.rules['index-top-level'], {
  valid: [
    {name: 'should not judge a file that is not an index', code: "export * from './placement';", filename: withIndex},
    {name: 'should count an import of a top-level directory by its bare alias, as src imports http from @transport', code: "export {http} from './http';", filename: at('src/transport/index.ts')}
  ],
  invalid: [
    {name: 'should refuse an index that exports everything unnamed', code: "export * from './placement';", filename: at('src/banners/index.ts'), errors: [{messageId: 'broken'}]},
    {name: 'should refuse an index that exports from a nested directory', code: "export {x} from './__tests__/x';", filename: at('src/banners/index.ts'), errors: 1}
  ]
});
