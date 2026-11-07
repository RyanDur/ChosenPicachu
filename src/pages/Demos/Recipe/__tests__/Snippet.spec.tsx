import {render} from '@testing-library/react';
import {Snippet} from '../Snippet';
import {lines} from '../lines';
import {carve} from '../carve';
import {aSample, codeSample} from '../__test_support';
import {CodeFile} from '../sample';

const {aside, plain} = lines();
const {span} = carve();

const store = aSample('export const store = 1;\nexport const more = 2;\n', 'src/pages/Demos/store.ts');
const shared = aSample('export type Store = {};\n', 'src/components/store.ts');

describe('a code sample', () => {
  test('should name the file it was taken from, and link to it on GitHub', () => {
    render(<Snippet label="TS" lines={span(store, 'export const store', 'export const more')}/>);

    expect(codeSample.fileLink('Demos/store.ts on GitHub')).toHaveAttribute('href', `${store.url}#L1-L2`);
  });

  test('should name the library a sample was taken from before its file', () => {
    const library: CodeFile = {path: 'src/lib/util/index.ts', url: 'https://github.com/RyanDur/sand/blob/main/src/lib/util/index.ts', owner: 'sand'};
    render(<Snippet label="TS" lines={[{text: 'export const has = notEmpty;', from: {file: library, line: 188}}]}/>);

    expect(codeSample.fileLink('sand’s util/index.ts on GitHub')).toHaveAttribute('href', `${library.url}#L188-L188`);
  });

  test('should link each file it was taken from, in the order they first appear', () => {
    render(<Snippet label="TS" lines={[
      ...span(shared, 'export type Store', 'export type Store'), plain(' '),
      ...span(store, 'export const store', 'export const store'),
      ...span(shared, 'export type Store', 'export type Store')
    ]}/>);

    expect(codeSample.fileNames()).toEqual(['components/store.ts on GitHub', 'Demos/store.ts on GitHub']);
  });

  test('should open each file at the lines the sample took from it', () => {
    render(<Snippet label="TS" lines={[
      ...span(store, 'export const more', 'export const more'),
      ...span(shared, 'export type Store', 'export type Store')
    ]}/>);

    expect(codeSample.fileAddresses()).toEqual([`${store.url}#L2-L2`, `${shared.url}#L1-L1`]);
  });

  test('should show each line of a carved sample with its indent, as it reads in the file', () => {
    const travel = aSample('const travel = (event) => {\n  if (event.buttons === 0) {\n    drop();\n  }\n};\n');
    render(<Snippet label="TS" lines={[...span(travel, 'const travel', '};'), aside('  // dimmed, and indented')]}/>);

    expect(codeSample.code()).toEqual([
      'const travel = (event) => {',
      '  if (event.buttons === 0) {',
      '    drop();',
      '  }',
      '};',
      '  // dimmed, and indented'
    ]);
  });

  test('should link to no file when it was written for the page and not taken from the code', () => {
    render(<Snippet label="CSS" lines={[plain('.fold {'), aside('/* written here */'), plain('}')]}/>);

    expect(codeSample.fileNames()).toEqual([]);
  });

  test('should show a file directly under src with its folder', () => {
    const sheet = aSample('.x {}\n', 'src/index.css');
    render(<Snippet label="CSS" lines={span(sheet, '.x {', '.x {')}/>);

    expect(codeSample.fileLink('src/index.css on GitHub')).toBeInTheDocument();
  });
});
