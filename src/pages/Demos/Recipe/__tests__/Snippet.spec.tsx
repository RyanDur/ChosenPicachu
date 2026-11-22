import {render} from '@testing-library/react';
import {Snippet} from '../Snippet';
import {lines} from '../lines';
import {carve} from '../carve';
import {aSample, codeSample} from '../__test_support';
import {CodeFile} from '../sample';

const store = aSample('export const store = 1;\nexport const more = 2;\n', 'src/pages/Demos/store.ts');
const shared = aSample('export type Store = {};\n', 'src/components/store.ts');
const panel = aSample('export const panel = 3;\n', 'src/pages/Demos/panel.ts');

describe('a code sample', () => {
  test('should name the file it was taken from, and link to it on GitHub', () => {
    render(<Snippet label="TS" lines={carve.between(store, 'export const store', 'export const more')}/>);

    expect(codeSample.fileLink('Demos/store.ts on GitHub')).toHaveAttribute('href', `${store.url}#L1-L2`);
  });

  test('should name the library a sample was taken from before its file', () => {
    const library: CodeFile = {path: 'src/lib/util/index.ts', url: 'https://github.com/RyanDur/sand/blob/main/src/lib/util/index.ts', owner: 'sand'};
    render(<Snippet label="TS" lines={[{text: 'export const has = notEmpty;', from: {file: library, line: 188, kind: 'linked'}}]}/>);

    expect(codeSample.fileLink('sand’s util/index.ts on GitHub')).toHaveAttribute('href', `${library.url}#L188-L188`);
  });

  test('should link each file it was taken from, in the order they first appear', () => {
    render(<Snippet label="TS" lines={[
      ...carve.between(shared, 'export type Store', 'export type Store'), lines.plain(' '),
      ...carve.between(store, 'export const store', 'export const store'),
      ...carve.between(shared, 'export type Store', 'export type Store')
    ]}/>);

    expect(codeSample.fileNames()).toEqual(['components/store.ts on GitHub', 'Demos/store.ts on GitHub']);
  });

  test('should open each file at the lines the sample took from it', () => {
    render(<Snippet label="TS" lines={[
      ...carve.between(store, 'export const more', 'export const more'),
      ...carve.between(shared, 'export type Store', 'export type Store')
    ]}/>);

    expect(codeSample.fileAddresses()).toEqual([`${store.url}#L2-L2`, `${shared.url}#L1-L1`]);
  });

  test('should show each line of a carved sample with its indent, as it reads in the file', () => {
    const travel = aSample('const travel = (event) => {\n  if (event.buttons === 0) {\n    drop();\n  }\n};\n');
    render(<Snippet label="TS" lines={[...carve.between(travel, 'const travel', '};'), lines.aside('  // dimmed, and indented')]}/>);

    expect(codeSample.code()).toEqual([
      'const travel = (event) => {',
      '  if (event.buttons === 0) {',
      '    drop();',
      '  }',
      '};',
      '  // dimmed, and indented'
    ]);
  });

  test('should mark the lines it is asked to mark, and only those', () => {
    render(<Snippet label="CSS" lines={[lines.plain('.b {'), lines.plain('}'), ...lines.marked([lines.plain('.a {'), lines.plain('}')])]}/>);

    expect(codeSample.marked()).toEqual(['.a {\n', '}\n']);
  });

  test('should link to no file when it was written for the page and not taken from the code', () => {
    render(<Snippet label="CSS" lines={[lines.plain('.fold {'), lines.aside('/* written here */'), lines.plain('}')]}/>);

    expect(codeSample.fileNames()).toEqual([]);
  });

  test('should say a sample written for the page was written for it', () => {
    render(<Snippet label="CSS" lines={[lines.plain('.fold {'), lines.plain('}')]}/>);

    expect(codeSample.source()).toBe('Written for this page, not taken from the site’s code.');
  });

  test('should say a sample carved from the page’s exhibit was taken from it', () => {
    render(<Snippet label="TS" lines={lines.fromTheExhibit(carve.between(store, 'export const store', 'export const more'))}/>);

    expect(codeSample.source()).toMatch(/^Demos\/store\.ts on GitHub\s+Taken from the exhibit on this page\.$/);
  });

  test('should link the file a sample carved from the page’s exhibit was taken from', () => {
    render(<Snippet label="TS" lines={lines.fromTheExhibit(carve.between(store, 'export const store', 'export const more'))}/>);

    expect(codeSample.fileLink('Demos/store.ts on GitHub')).toHaveAttribute('href', `${store.url}#L1-L2`);
  });

  test('should list the exhibit’s files before the site’s when a sample holds both', () => {
    render(<Snippet label="TS" lines={[
      ...carve.between(shared, 'export type Store', 'export type Store'),
      ...lines.fromTheExhibit(carve.between(store, 'export const store', 'export const store'))
    ]}/>);

    expect(codeSample.fileNames()).toEqual(['Demos/store.ts on GitHub', 'components/store.ts on GitHub']);
  });

  test('should say the exhibit’s files are the exhibit’s before it names the site’s files', () => {
    render(<Snippet label="TS" lines={[
      ...carve.between(shared, 'export type Store', 'export type Store'),
      ...lines.fromTheExhibit(carve.between(store, 'export const store', 'export const store'))
    ]}/>);

    expect(codeSample.source()).toMatch(
      /^Demos\/store\.ts on GitHub\s+Taken from the exhibit on this page\.\s+components\/store\.ts on GitHub$/);
  });

  test('should say once, after both, that a sample taking from two of the exhibit’s files was taken from the exhibit', () => {
    render(<Snippet label="TS" lines={[
      ...lines.fromTheExhibit(carve.between(store, 'export const store', 'export const store')),
      ...lines.fromTheExhibit(carve.between(panel, 'export const panel', 'export const panel'))
    ]}/>);

    expect(codeSample.source())
      .toMatch(/^Demos\/store\.ts on GitHub\s*Demos\/panel\.ts on GitHub\s+Taken from the exhibit on this page\.$/);
  });

  test('should not call a file the exhibit’s alone when the sample also takes it plainly', () => {
    render(<Snippet label="TS" lines={[
      ...lines.fromTheExhibit(carve.between(store, 'export const store', 'export const store')),
      ...carve.between(store, 'export const more', 'export const more')
    ]}/>);

    expect(codeSample.fileNames()).toEqual(['Demos/store.ts on GitHub']);
    expect(codeSample.source()).not.toContain('Taken from the exhibit');
  });

  test('should name what a lowercase folder sits inside, since it is a module of that component', () => {
    const survey = aSample('export const survey = 1;\n', 'src/components/DragSortableTable/model/survey.ts');
    render(<Snippet label="TS" lines={carve.between(survey, 'export const survey', 'export const survey')}/>);

    expect(codeSample.fileLink('DragSortableTable/model/survey.ts on GitHub')).toBeInTheDocument();
  });

  test('should show a file directly under src with its folder', () => {
    const sheet = aSample('.x {}\n', 'src/index.css');
    render(<Snippet label="CSS" lines={carve.between(sheet, '.x {', '.x {')}/>);

    expect(codeSample.fileLink('src/index.css on GitHub')).toBeInTheDocument();
  });
});
