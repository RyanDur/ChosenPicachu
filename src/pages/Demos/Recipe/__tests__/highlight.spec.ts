import {Kind, highlight} from '../highlight';

// language=TypeScript
const columnAlias = 'export type Column<C> = {readonly name: string; readonly width?: number; readonly data: C};';

const kinds = (label: 'HTML' | 'CSS' | 'TS', line: string): Record<string, Kind> =>
  Object.fromEntries(highlight.tokensOf(label, line).filter(({kind}) => kind !== 'plain').map(({text, kind}) => [text, kind]));

describe('the code voice', () => {
  it('reads a JSX comment in a TS line as a comment', () => {
    expect(kinds('TS', '<p>{/* note */}</p>')['{/* note */}']).toBe('comment');
  });

  it('reads a JSX comment in markup as a comment', () => {
    expect(kinds('HTML', '<p>{/* note */}</p>')['{/* note */}']).toBe('comment');
  });

  it('reads an HTML comment in markup as a comment', () => {
    expect(kinds('HTML', '<p>text</p><!-- aside -->')['<!-- aside -->']).toBe('comment');
  });

  it('keeps a URL in a TS string a string', () => {
    expect(kinds('TS', "const link = 'https://example.com';")["'https://example.com'"]).toBe('string');
  });

  it('keeps a URL in a JSX comment one comment', () => {
    expect(kinds('TS', '<p>{/* see https://mdn.io */}</p>')['{/* see https://mdn.io */}']).toBe('comment');
  });

  it('keeps a protocol-relative URL in a TS string a string', () => {
    expect(kinds('TS', "fetch('//fonts.example.com/a.css');")["'//fonts.example.com/a.css'"]).toBe('string');
  });

  it('keeps a file URL in a TS string a string', () => {
    expect(kinds('TS', "const u = 'file:///etc/hosts';")["'file:///etc/hosts'"]).toBe('string');
  });

  it('keeps a JSX comment that holds two slashes one comment', () => {
    expect(kinds('TS', '{/* a // b */}')['{/* a // b */}']).toBe('comment');
  });

  it('keeps a JSX comment after an apostrophe in JSX text a comment', () => {
    expect(kinds('TS', "<p>Don't</p>{/* it's here */}")["{/* it's here */}"]).toBe('comment');
  });

  it('keeps a line comment after an apostrophe in JSX text a comment', () => {
    expect(kinds('TS', "<p>Don't stop</p>; // it's fine")["// it's fine"]).toBe('comment');
  });

  it('still reads a line comment after code as a comment', () => {
    expect(kinds('TS', 'const at = 0; // where it starts')['// where it starts']).toBe('comment');
  });

  it('reads a JSX line the way an editor does: tags, props and strings', () => {
    const line = '    trades: <DraggableColumn key="trades" name="trades">trades<SortMenu column="trades"/></DraggableColumn>,';

    const found = kinds('TS', line);

    expect(found.DraggableColumn).toBe('tag');
    expect(found.SortMenu).toBe('tag');
    expect(found.key).toBe('attribute');
    expect(found.name).toBe('attribute');
    expect(found.column).toBe('attribute');
    expect(found['"trades"']).toBe('string');
  });

  it('reads a TS line as keywords, types and calls', () => {
    const line = 'export const columns = useTableSelector(selectColumns<Measured, Measures>);';

    const found = kinds('TS', line);

    expect(found.export).toBe('keyword');
    expect(found.const).toBe('keyword');
    expect(found.useTableSelector).toBe('call');
    expect(found.Measured).toBe('type');
    expect(found.Measures).toBe('type');
  });

  it('brackets stay plain', () => {
    const found = kinds('TS', 'export const columns = useTableSelector(selectColumns<Measured, Measures>);');

    expect(found['(']).toBeUndefined();
  });

  it('generics on a type alias are types', () => {
    const found = kinds('TS', columnAlias);

    expect(found.Column).toBe('type');
  });

  it('readonly is a keyword', () => {
    const found = kinds('TS', columnAlias);

    expect(found.readonly).toBe('keyword');
  });

  it('a CSS line names its property and its call', () => {
    const found = kinds('CSS', '  padding-inline-start: var(--base-x-1_25);');

    expect(found['padding-inline-start']).toBe('attribute');
    expect(found.var).toBe('call');
  });

  it('an HTML line names its tag and attributes', () => {
    const found = kinds('HTML', '<th scope="col" class="cell window header-cell" aria-label="window">window');

    expect(found.th).toBe('tag');
    expect(found.scope).toBe('attribute');
    expect(found['aria-label']).toBe('attribute');
    expect(found['"window"']).toBe('string');
  });
});
