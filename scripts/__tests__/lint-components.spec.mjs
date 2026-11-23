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
    {name: 'should accept a function handed by name to something other than map', code: 'const header = topic => <h1>{topic}</h1>;\nconst shown = concern.either(header, () => null);'},
    {
      name: 'should accept a call of a local that shadows a function returning JSX',
      code: 'const label = x => <span>{x}</span>;\nconst Count = ({n}) => {\n  const label = m => `${m} items`;\n  return <p>{label(n)}</p>;\n};'
    },
    {
      name: 'should not count JSX returned from an inner callback as the outer function\'s',
      code: 'const names = list => list.map(name => { return <li>{name}</li>; });\nconst shown = names(list);'
    },
    {name: 'should accept a call of a prop', code: 'const Picks = ({onPicked}) => <button onClick={() => onPicked(1)}/>;'}
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
    }
  ]
});

tester.run('no-forwarded-props', components.rules['no-forwarded-props'], {
  valid: [
    {name: 'should accept a prop the component reads itself', code: 'const Count = ({parts}) => <p>{parts.length}</p>;'},
    {name: 'should accept a prop read here and also given to a component', code: 'const Part = ({part}) => <section><h2>{part.name}</h2><PartFoot part={part}/></section>;'},
    {name: 'should accept a class name handed to the component inside', code: 'const Plate = ({className}) => <Card className={className}/>;'},
    {name: 'should accept an id handed on under another prop name', code: 'const StoryCard = ({titleId}) => <Can id={titleId}/>;'},
    {name: 'should accept a label handed on as an aria attribute', code: 'const Framed = ({linkName}) => <Link aria-label={linkName}/>;'},
    {name: 'should accept a handler handed to the component that fires it', code: 'const UserMenu = ({onRemoved}) => <Item onClick={onRemoved}/>;'},
    {name: 'should accept a prop given to an element', code: 'const Field = ({shown}) => <output value={shown}/>;'},
    {name: 'should leave a lower-case function that returns JSX to rendered-as-jsx', code: 'const rowOf = ({groups}) => <Row groups={groups}/>;'},
    {name: 'should accept a value given to the context that will hold it', code: 'const Frame = ({pageUnknown, children}) => <PageUnknown.Provider value={pageUnknown}>{children}</PageUnknown.Provider>;'},
    {name: 'should accept a value given to a provider component', code: 'const SiteProviders = ({environment, children}) => <EnvironmentProvider environment={environment}>{children}</EnvironmentProvider>;'},
    {name: 'should accept a value handed to the control inside', code: 'const Dial = ({value}) => <Pill value={value}/>;'},
    {name: 'should accept open handed to the fold inside', code: 'const Story = ({open}) => <Fold open={open}/>;'},
    {name: 'should accept the rest of the attributes spread onto an element', code: 'const Field = ({label, ...rest}) => <label>{label}<input {...rest}/></label>;'},
    {name: 'should accept the rest of a control\'s attributes spread onto the control inside', code: 'const ItemLink = ({className, ...link}) => <Link {...link} className={className}/>;'},
    {name: 'should accept the rest spread onto the control either branch returns', code: 'const DateInput = ({readOnly, ...rest}) => readOnly ? <Input type="text" readOnly {...rest}/> : <Input type="date" {...rest}/>;'},
    {name: 'should accept an element spreading its own attributes', code: 'const Pill = props => <input {...props}/>;'}
  ],
  invalid: [
    {
      name: 'should refuse a prop received only to be given to another component',
      code: 'const PartsBeside = ({groups, children}) => <aside><PartsList groups={groups}/>{children}</aside>;',
      errors: [{messageId: 'forwarded', data: {name: 'groups'}}]
    },
    {
      name: 'should refuse a prop given to two components and read by neither giver',
      code: 'const DemoTabs = ({topic}) => <nav><DemoTab current={topic}/><TabPager topic={topic}/></nav>;',
      errors: [{messageId: 'forwarded', data: {name: 'topic'}}]
    },
    {
      name: 'should refuse a renamed prop received only to be given on',
      code: 'function Exhibit({folds: given}) { return <Platform folds={given}/>; }',
      errors: [{messageId: 'forwarded', data: {name: 'folds'}}]
    },
    {
      name: 'should refuse a prop given on through a context member\'s tag',
      code: 'const Shell = ({can}) => <Story.Card can={can}/>;',
      errors: [{messageId: 'forwarded', data: {name: 'can'}}]
    },
    {
      name: 'should refuse a component that spreads all its props onto another',
      code: 'const Story = told => <StoryShell {...told}/>;',
      errors: [{messageId: 'spread', data: {name: 'told'}}]
    },
    {
      name: 'should refuse the rest of the props spread onto a component inside',
      code: 'const DialRow = ({label, ...pills}) => <li>{label}<PillGlider {...pills}/></li>;',
      errors: [{messageId: 'rest', data: {name: 'pills'}}]
    },
    {
      name: 'should refuse a member of the props received only to be given on',
      code: 'const Story = props => <StoryShell groups={props.groups}/>;',
      errors: [{messageId: 'forwarded', data: {name: 'groups'}}]
    },
    {
      name: 'should refuse a prop given on from a memoized component',
      code: 'const Shell = memo(({can}) => <Story can={can}/>);',
      errors: [{messageId: 'forwarded', data: {name: 'can'}}]
    },
    {
      name: 'should refuse a prop given on through a cast',
      code: 'const Shell = ({can}) => <Story can={can as string}/>;',
      filename: 'Shell.tsx',
      errors: [{messageId: 'forwarded', data: {name: 'can'}}]
    }
  ]
});
