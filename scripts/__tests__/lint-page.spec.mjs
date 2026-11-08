import {RuleTester} from 'eslint';
import parser from '@babel/eslint-parser';
import {page} from '../lint/page.mjs';

const tester = new RuleTester({languageOptions: {
  parser,
  parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript']}}
}});

const ts = cases => cases.map(item => ({...item, filename: 'probe.ts'}));

tester.run('no-page-globals', page.rules['no-page-globals'], {
  valid: ts([
    {name: 'should accept a type member named window', code: 'type W = {window: string}; export const w: W = {window: \'1m\'};'},
    {name: 'should accept an interface member named document', code: 'interface D {document: number}'},
    {name: 'should accept a property read named window', code: 'export const label = (row: {window: string}) => row.window;'},
    {name: 'should accept a local binding of the same name', code: 'export const at = (document: string) => document.length;'}
  ]),
  invalid: ts([
    {name: 'should refuse a read of the document', code: 'export const b = document.getElementById(\'banners\');', errors: [{messageId: 'reached', data: {name: 'document'}}]},
    {name: 'should refuse a read of the window', code: 'export const y = () => window.scrollY;', errors: [{messageId: 'reached', data: {name: 'window'}}]}
  ])
});
