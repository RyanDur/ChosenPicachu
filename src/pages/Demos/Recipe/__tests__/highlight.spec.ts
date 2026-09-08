import {Kind, highlight} from '../highlight';

const kinds = (label: 'HTML' | 'CSS' | 'TS', line: string): Record<string, Kind> =>
  Object.fromEntries(highlight(label, line).filter(({kind}) => kind !== 'plain').map(({text, kind}) => [text, kind]));

describe('the code voice', () => {
  it('reads a JSX line the way an editor does: tags, props, strings, and calls', () => {
    const line = `    trades: <DraggableColumn key="trades" name="trades">trades<SortMenu column="trades"/></DraggableColumn>,`;

    const found = kinds('TS', line);

    expect(found.DraggableColumn).toBe('tag');
    expect(found.SortMenu).toBe('tag');
    expect(found.key).toBe('attribute');
    expect(found.name).toBe('attribute');
    expect(found.column).toBe('attribute');
    expect(found['"trades"']).toBe('string');
  });

  it('reads a TS line: keywords, types, calls, punctuation', () => {
    const line = `export const columns = useTableSelector(selectColumns<Measured, Measures>);`;

    const found = kinds('TS', line);

    expect(found.export).toBe('keyword');
    expect(found.const).toBe('keyword');
    expect(found.useTableSelector).toBe('call');
    expect(found.Measured).toBe('type');
    expect(found.Measures).toBe('type');
    expect(found['(']).toBe('punctuation');
  });

  it('types after a colon and generics on a type alias are types', () => {
    const found = kinds('TS', `export type Column<C> = {readonly name: string; readonly width?: number; readonly data: C};`);

    expect(found.Column).toBe('type');
    expect(found.readonly).toBe('keyword');
  });

  it('a CSS line names its property, its call, and its number', () => {
    const found = kinds('CSS', `  padding-inline-start: var(--base-x-1_25);`);

    expect(found['padding-inline-start']).toBe('attribute');
    expect(found.var).toBe('call');
  });

  it('an HTML line names its tag and attributes', () => {
    const found = kinds('HTML', `<th scope="col" class="cell window header-cell" aria-label="window">window`);

    expect(found.th).toBe('tag');
    expect(found.scope).toBe('attribute');
    expect(found['aria-label']).toBe('attribute');
    expect(found['"window"']).toBe('string');
  });
});
