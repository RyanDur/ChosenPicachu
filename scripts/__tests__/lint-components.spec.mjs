import {RuleTester} from 'eslint';
import parser from '@babel/eslint-parser';
import {components} from '../lint/components.mjs';

const tester = new RuleTester({languageOptions: {
  parser,
  parserOptions: {requireConfigFile: false, babelOptions: {presets: ['@babel/preset-typescript'], plugins: ['@babel/plugin-syntax-jsx']}}
}});

const listed = 'src/listed.tsx';

tester.run('rendered-as-jsx', components.rules['rendered-as-jsx'], {
  valid: [
    {name: 'should accept a component rendered as JSX', code: 'const TabHeader = ({topic}) => <h1>{topic}</h1>;\nconst page = <TabHeader topic="tables"/>;'},
    {name: 'should accept an inline arrow that returns JSX', code: 'const rows = names.map(name => <li>{name}</li>);'},
    {name: 'should accept a call of a function that returns no JSX', code: 'const label = topic => `Demos ${topic}`;\nconst title = label(topic);'},
    {name: 'should accept a function handed by name to something other than map', code: 'const header = topic => <h1>{topic}</h1>;\nconst shown = concern.either(header, () => null);'},
    {
      name: 'should accept a call of a local that shadows a function returning JSX',
      code: 'const label = x => <span>{x}</span>;\nconst Count = ({n}) => {\n  const label = m => `${m} items`;\n  return <p>{label(n)}</p>;\n};'
    },
    {
      name: 'should not count JSX returned from an inner callback as the outer function\'s',
      code: 'const names = list => list.map(name => { return <li>{name}</li>; });\nconst shown = names(list);'
    },
    {name: 'should accept a call of a prop', code: 'const Picks = ({onPicked}) => <button onClick={() => onPicked(1)}/>;'},
    {name: 'should accept a listed file that still makes a call', filename: listed, options: [{still: [listed]}],
      code: 'const header = x => <h1>{x}</h1>;\nconst page = header(1);'}
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
    },
    {
      name: 'should refuse a function whose JSX is one side of a choice',
      code: 'const shown = x => x ? <a/> : null;\nconst both = x => x && <b/>;\nshown(1);\nboth(1);',
      errors: [{messageId: 'called', data: {name: 'shown'}}, {messageId: 'called', data: {name: 'both'}}]
    },
    {
      name: 'should refuse a function expression assigned to a name',
      code: 'const row = function (r) { return <tr/>; };\nrow(1);',
      errors: [{messageId: 'called', data: {name: 'row'}}]
    },
    {
      name: 'should see through useCallback, a type assertion and a returned name',
      filename: 'src/typed.tsx',
      code: 'const row = useCallback(r => <tr/>, []);\nconst cell = ((c) => <td/>) as FC;\nconst note = () => { const said = <p/>; return said as ReactElement; };\nrows.map(row);\ncell(1);\nnote();',
      errors: [{messageId: 'called', data: {name: 'row'}}, {messageId: 'called', data: {name: 'cell'}}, {messageId: 'called', data: {name: 'note'}}]
    },
    {
      name: 'should tell a component called as a function to render it',
      code: 'const TabHeader = ({topic}) => <h1>{topic}</h1>;\nconst page = TabHeader({topic});',
      errors: [{message: 'render TabHeader as JSX, <Name …/>, and name it in PascalCase if it isn\'t'}]
    },
    {
      name: 'should report a listed file that keeps the rule now',
      filename: listed, options: [{still: [listed]}],
      code: 'const Header = ({x}) => <h1>{x}</h1>;\nconst page = <Header x={1}/>;',
      errors: [{messageId: 'mended', data: {file: listed}}]
    }
  ]
});
