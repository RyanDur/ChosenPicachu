import {ESLint, RuleTester} from 'eslint';
import {mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {classes, classesOver} from '../lint/classes.mjs';

const fancyField = join(process.cwd(), 'src/pages/Users/FancyFormElements/Probe.tsx');
const banners = join(process.cwd(), 'src/banners/Probe.tsx');
const frameBuild = join(process.cwd(), 'src/pages/Demos/Tables/Frame/builds/Probe.ts');
const candle = join(process.cwd(), 'src/pages/Demos/Charts/Candles/Probe.tsx');

const tester = new RuleTester({languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}}});
const unread = name => ({messageId: 'undefined', data: {name}});

tester.run('class-defined', classes.rules['class-defined'], {
  valid: [
    {name: 'should accept a class a sheet reads', code: '<p className="muted-ink"/>', filename: fancyField},
    {name: 'should accept a template whose prefix opens a class', code: 'const p = <p className={`stack-${side}`}/>;', filename: banners},
    {name: 'should read a comparison as no class', code: "const p = <p className={classNames(state === 'refused' && 'muted-ink')}/>;", filename: fancyField},
    {name: 'should accept a class a classList call adds', code: "cell.classList.add('muted-ink');", filename: fancyField},
    {name: 'should accept a class an html class attribute wears', code: "__htmlClass('fancy muted-ink');", filename: fancyField},
    {name: 'should accept a class a sheet in a folder above reads', code: '<header className="chart-header"/>', filename: candle},
    {name: 'should accept a class the frame world imports, in a file inside the frame', code: "cell.classList.add('grabbable');", filename: frameBuild}
  ],
  invalid: [
    {name: 'should refuse a class no sheet reads', code: '<p className="no-such-word"/>', filename: fancyField, errors: [unread('no-such-word')]},
    {name: 'should refuse a class only another component\'s sheet reads', code: '<p className="fancy"/>', filename: banners, errors: [unread('fancy')]},
    {name: 'should refuse a template prefix no class starts with', code: 'const p = <p className={`nowhere-${side}`}/>;', filename: fancyField, errors: [{messageId: 'unopened', data: {prefix: 'nowhere-'}}]},
    {name: 'should read both sides of a ternary', code: "const p = <p className={on ? 'no-such-word' : 'nor-this'}/>;", filename: fancyField, errors: [unread('no-such-word'), unread('nor-this')]},
    {name: 'should read the right side of &&', code: "const p = <p className={classNames('muted-ink', on && 'no-such-word')}/>;", filename: fancyField, errors: [unread('no-such-word')]},
    {name: 'should read the classes a className function returns', code: "const p = <NavLink className={() => 'no-such-word'}/>;", filename: fancyField, errors: [unread('no-such-word')]},
    {name: 'should read what a classList call adds', code: "cell.classList.toggle('no-such-word', on);", filename: fancyField, errors: [unread('no-such-word')]},
    {name: 'should read what an html class attribute wears', code: "__htmlClass('muted-ink no-such-word');", filename: fancyField, errors: [unread('no-such-word')]},
    {name: 'should read both sides of || and ??', code: "const p = <p className={classNames('no-such-word' || 'nor-this', 'nor-that' ?? 'nor-these')}/>;", filename: fancyField, errors: [unread('no-such-word'), unread('nor-this'), unread('nor-that'), unread('nor-these')]}
  ]
});

tester.run('own-class-first', classes.rules['own-class-first'], {
  valid: [
    {name: 'should accept an own class first', code: '<p className="fancy muted-ink"/>', filename: fancyField},
    {name: 'should accept an element that wears only shared words', code: '<p className="muted-ink bold"/>', filename: fancyField},
    {name: 'should not judge the order of a classNames call that opens with a condition', code: "const p = <p className={classNames(on && 'muted-ink', 'fancy')}/>;", filename: fancyField}
  ],
  invalid: [
    {name: 'should refuse an own class behind a shared word', code: '<p className="muted-ink fancy"/>', filename: fancyField, errors: [{messageId: 'behind', data: {name: 'fancy'}}]},
    {name: 'should refuse it in a className function too', code: "const p = <NavLink className={() => 'muted-ink fancy'}/>;", filename: fancyField, errors: [{messageId: 'behind', data: {name: 'fancy'}}]},
    {name: 'should refuse it in a classNames call too', code: "const p = <p className={classNames('muted-ink', 'fancy')}/>;", filename: fancyField, errors: [{messageId: 'behind', data: {name: 'fancy'}}]},
    {name: 'should refuse it in an html class attribute too', code: "__htmlClass('muted-ink fancy');", filename: fancyField, errors: [{messageId: 'behind', data: {name: 'fancy'}}]}
  ]
});

describe('the class rules over html', () => {
  const eslint = new ESLint({overrideConfigFile: true, overrideConfig: [
    {files: ['**/*.html'], plugins: {classes}, processor: 'classes/html'},
    {files: ['**/*.html/*.htmlclasses'], plugins: {classes}, rules: {'classes/class-defined': 'error', 'classes/own-class-first': 'error'}}
  ]});
  const linted = async html => {
    const [{messages}] = await eslint.lintText(html, {filePath: 'src/pages/Users/FancyFormElements/frame.html'});
    return messages.map(({line, message}) => ({line, message}));
  };

  test('should refuse a class no sheet reads, on the line that wears it', async () => {
    expect(await linted('<p>\n  <span class="muted-ink no-such-word"></span>\n</p>')).toEqual([
      {line: 2, message: '"no-such-word" is read by no sheet beside this file, above it, or in src/styles; a class an element wears is one a sheet near it reads'}
    ]);
  });

  test('should refuse an own class behind a shared word, on the line that wears it', async () => {
    expect(await linted('<p>\n  <span class="muted-ink fancy"></span>\n</p>')).toEqual([
      {line: 2, message: '"fancy" is this element\'s own class and comes first, before the shared words it wears'}
    ]);
  });

  test('should accept a class list a sheet reads, own class first', async () => {
    expect(await linted('<span class="fancy muted-ink"></span>')).toEqual([]);
  });
});

describe('the class rules in a process that keeps running', () => {
  let src;
  let eslint;
  const sheetAt = () => join(src, 'pages', 'LintProbe.css');
  const findingsIn = async (code, filePath = join(src, 'pages', 'Probe.tsx')) => {
    const [{messages}] = await eslint.lintText(code, {filePath});
    return messages.map(({ruleId}) => ruleId);
  };
  const reads = name => writeFileSync(sheetAt(), `.${name} {\n  display: block;\n}\n`);

  beforeEach(() => {
    src = join(mkdtempSync(join(tmpdir(), 'lint-classes-')), 'src');
    mkdirSync(join(src, 'pages'), {recursive: true});
    mkdirSync(join(src, 'styles'));
    writeFileSync(join(src, 'styles', 'words.css'), '.muted-ink {\n  color: gray;\n}\n');
    eslint = new ESLint({cwd: dirname(src), overrideConfigFile: true, overrideConfig: [
      {files: ['**/*.tsx'], plugins: {classes: classesOver(src)},
        languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}},
        rules: {'classes/class-defined': 'error', 'classes/own-class-first': 'error'}}
    ]});
  });
  afterEach(() => rmSync(dirname(src), {recursive: true, force: true}));

  test('should read a class a sheet began reading after the process started', async () => {
    const code = '<p className="lint-probe-word"/>;';
    expect(await findingsIn(code)).toEqual(['classes/class-defined']);
    reads('lint-probe-word');
    expect(await findingsIn(code)).toEqual([]);
  });

  test('should read a sheet again after it is edited', async () => {
    const code = '<p className="lint-probe-edited"/>;';
    reads('lint-probe-word');
    expect(await findingsIn(code)).toEqual(['classes/class-defined']);
    reads('lint-probe-edited');
    expect(await findingsIn(code)).toEqual([]);
  });

  test('should refuse a class again after its sheet is deleted', async () => {
    const code = '<p className="lint-probe-word"/>;';
    reads('lint-probe-word');
    expect(await findingsIn(code)).toEqual([]);
    rmSync(sheetAt());
    expect(await findingsIn(code)).toEqual(['classes/class-defined']);
  });

  test('should read a style sheet that is a link to one elsewhere', async () => {
    const elsewhere = join(dirname(src), 'Linked.css');
    writeFileSync(elsewhere, '.lint-probe-linked {\n  display: block;\n}\n');
    symlinkSync(elsewhere, join(src, 'pages', 'Linked.css'));

    expect(await findingsIn('<p className="lint-probe-linked"/>;')).toEqual([]);
  });

  test('should skip a folder named like a source file beside the linted file', async () => {
    mkdirSync(join(src, 'pages', 'folder.tsx'));

    expect(await findingsIn('<p className="muted-ink"/>;')).toEqual([]);
  });

  test('should judge a file whose folder is gone by the shared words alone', async () => {
    const code = '<p className="muted-ink lint-probe-word"/>;';
    expect(await findingsIn(code, join(src, 'pages', 'NoSuchFolder', 'Gone.tsx'))).toEqual(['classes/class-defined']);
  });

  test('should put an own class first once a sheet beside it begins reading it', async () => {
    const code = '<p className="muted-ink lint-probe-word"/>;';
    expect(await findingsIn(code)).toEqual(['classes/class-defined']);
    reads('lint-probe-word');
    expect(await findingsIn(code)).toEqual(['classes/own-class-first']);
  });
});
