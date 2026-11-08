import {RuleTester} from 'eslint';
import parser from '@babel/eslint-parser';
import {components} from '../lint/components.mjs';

const tester = new RuleTester({languageOptions: {
  parser,
  parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-syntax-jsx']}}
}});

tester.run('rendered-as-jsx', components.rules['rendered-as-jsx'], {
  valid: [
    {name: 'should accept a component rendered as JSX', code: 'const TabHeader = ({topic}) => <h1>{topic}</h1>;\nconst page = <TabHeader topic="tables"/>;'},
    {name: 'should accept an inline arrow that returns JSX', code: 'const rows = names.map(name => <li>{name}</li>);'},
    {name: 'should accept a call of a function that returns no JSX', code: 'const label = topic => `Demos ${topic}`;\nconst title = label(topic);'},
    {name: 'should accept a function handed by name to something other than map', code: 'const header = topic => <h1>{topic}</h1>;\nconst shown = concern.either(header, () => null);'}
  ],
  invalid: [
    {
      name: 'should refuse a call of a function whose body is JSX',
      code: 'const tabHeader = topic => <h1>{topic}</h1>;\nconst page = tabHeader(topic);',
      errors: [{messageId: 'called', data: {name: 'tabHeader'}}]
    },
    {
      name: 'should refuse a call of a function that returns JSX from a branch',
      code: 'const said = draft => {\n  if (draft.sent) return <a href="/">Read it</a>;\n  return \'\';\n};\nconst words = said(draft);',
      errors: [{messageId: 'called', data: {name: 'said'}}]
    },
    {
      name: 'should refuse a function that returns JSX handed to map by name',
      code: 'function headerOf(concern) { return <h1>{concern}</h1>; }\nconst header = useConcern().map(headerOf);',
      errors: [{messageId: 'called', data: {name: 'headerOf'}}]
    }
  ]
});
