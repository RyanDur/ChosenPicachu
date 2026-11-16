import {highlight, Kind} from '../highlight';

// language=TypeScript
const columnAlias = 'export type Column<C> = {readonly name: string; readonly width?: number; readonly data: C};';

const kinds = (label: 'HTML' | 'CSS' | 'TS', line: string): Record<string, Kind> =>
  Object.fromEntries(highlight.tokensOf(label, [line]).flat()
    .filter(({kind}) => kind !== 'plain')
    .map(({text, kind}) => [text, kind]));

const constOnTheLineAfter = (line: string): Kind | undefined =>
  highlight.tokensOf('TS', [line, 'const a = 1;'])[1].find(({text}) => text === 'const')?.kind;

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

  it('keeps a JSX comment after a possessive on a closing tag a comment', () => {
    expect(kinds('TS', "<b>Ryan</b>'s note {/* it's here */}")["{/* it's here */}"]).toBe('comment');
  });

  it('keeps an apostrophe after a space in JSX text from opening a string', () => {
    const found = kinds('TS', "<p>the '90s</p>; const a = 'b';");

    expect(found.const).toBe('keyword');
    expect(found["'b'"]).toBe('string');
  });

  it('reads a quote after an arrow as a string', () => {
    expect(kinds('TS', "const door = (): Door => 'open';")["'open'"]).toBe('string');
  });

  it('reads a quote at the start of a line as a string', () => {
    expect(kinds('TS', "'a' : b")["'a'"]).toBe('string');
  });

  it('reads a quote after punctuation that starts a value as a string', () => {
    expect(kinds('TS', "f('a')")["'a'"]).toBe('string');
  });

  it('reads a quote after satisfies as a string', () => {
    expect(kinds('TS', "x satisfies 'a'")["'a'"]).toBe('string');
  });

  it('keeps a double quote in JSX text from opening a string', () => {
    expect(kinds('TS', '<p>A 12" ruler</p>{/* say "hi" */}')['{/* say "hi" */}']).toBe('comment');
  });

  it('keeps a quote after a word no value follows from opening a string', () => {
    expect(kinds('TS', "<p>Do it for 'em</p>{/* it's */}")["{/* it's */}"]).toBe('comment');
  });

  it('reads a quote at the start of a markup line as a string', () => {
    expect(kinds('HTML', "'note',")["'note'"]).toBe('string');
  });

  it('reads a quote after as as a string', () => {
    expect(kinds('TS', "const k = label as 'TS';")["'TS'"]).toBe('string');
  });

  it('reads a quote in a conditional type as a string', () => {
    expect(kinds('TS', "type K<T> = T extends 'a' ? 1 : 2;")["'a'"]).toBe('string');
  });

  it('keeps an apostrophe in markup text from opening a string', () => {
    const found = kinds('HTML', "<p>Don't stop</p><b>it's</b>");

    expect(found.b).toBe('tag');
    expect(Object.values(found)).not.toContain('string');
  });

  it('still reads an attribute value in markup as a string', () => {
    expect(kinds('HTML', '<p class="note">x</p>')['"note"']).toBe('string');
  });

  it('still reads a line comment after code as a comment', () => {
    expect(kinds('TS', 'const at = 0; // where it starts')['// where it starts']).toBe('comment');
  });

  it('keeps two slashes in JSX text from opening a line comment', () => {
    expect(kinds('TS', '<p>see https://mdn.io</p>{/* the docs */}')['{/* the docs */}']).toBe('comment');
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

  it('keeps a JSX comment after a question and an elided word a comment', () => {
    expect(kinds('TS', "<p>Why? 'Cause</p>{/* it's */}")["{/* it's */}"]).toBe('comment');
  });

  it('keeps an elided word after a comma from opening a string', () => {
    expect(Object.values(kinds('TS', "<p>Yes, 'tis</p>{/* it's */}"))).not.toContain('string');
  });

  it('keeps an elided word after a colon from opening a string', () => {
    expect(Object.values(kinds('TS', "<p>Note: 'twas</p>{/* it's */}"))).not.toContain('string');
  });

  it('reads a template tagged by a member as a string', () => {
    expect(kinds('TS', 'const t = x.y`tag`;')['`tag`']).toBe('string');
  });

  it('reads a template tagged by String.raw as a string', () => {
    expect(kinds('TS', 'const t = String.raw`a\\b`;')['`a\\b`']).toBe('string');
  });

  it('reads a quote in a type predicate as a string', () => {
    expect(kinds('TS', "const f = (x): x is 'a' => true;")["'a'"]).toBe('string');
  });

  it('reads a quote after keyof as a string', () => {
    expect(kinds('TS', "type K = keyof 'a';")["'a'"]).toBe('string');
  });

  it('reads a quote after a spread as a string', () => {
    expect(kinds('TS', "const l = [...'abc'];")["'abc'"]).toBe('string');
  });

  it('reads a quote after a tilde as a string', () => {
    expect(kinds('TS', "const n = ~'a';")["'a'"]).toBe('string');
  });

  it('reads code inside braces in markup as code', () => {
    expect(kinds('HTML', "<p>{x as 'y'}</p>")["'y'"]).toBe('string');
  });

  it('reads a multi-line template\'s closing line as the template\'s end', () => {
    const [, closing] = highlight.tokensOf('TS', ['const query = `{', '}`;']);

    expect(closing).toEqual([{text: '}`', kind: 'string'}, {text: ';', kind: 'plain'}]);
  });

  it('opens an element at the start of a line', () => {
    expect(kinds('TS', '<b>x').b).toBe('tag');
  });

  it('reads code inside a template\'s braces as code, and the template around it as a string', () => {
    const found = kinds('TS', 'const c = `a ${go()} c`;');

    expect(found['`a ${']).toBe('string');
    expect(found.go).toBe('call');
    expect(found['} c`']).toBe('string');
  });

  it('reads code in a template\'s braces as code across lines, and the template\'s end as a string', () => {
    const [, inside, closing] = highlight.tokensOf('TS', ['const to = `${from({', 'size: 1', '})}`;']);

    expect(inside).toEqual([{text: 'size: ', kind: 'plain'}, {text: '1', kind: 'number'}]);
    expect(closing).toEqual([{text: '})', kind: 'plain'}, {text: '}`', kind: 'string'}, {text: ';', kind: 'plain'}]);
  });

  it('keeps an escaped backtick inside its template', () => {
    expect(kinds('TS', 'const t = `a\\`b`;')['`a\\`b`']).toBe('string');
  });

  it('reads a template the sample leaves open as a string to the sample\'s end', () => {
    expect(highlight.tokensOf('TS', ['const q = `{', 'a'])).toEqual([
      [{text: 'const', kind: 'keyword'}, {text: ' q = ', kind: 'plain'}, {text: '`{', kind: 'string'}],
      [{text: 'a', kind: 'string'}]
    ]);
  });

  it('ends a line comment at the end of its line', () => {
    const [, next] = highlight.tokensOf('TS', ['go(); // soon', 'stop();']);

    expect(next).toEqual([{text: 'stop', kind: 'call'}, {text: '();', kind: 'plain'}]);
  });

  it('ends an unclosed quote at the end of its line', () => {
    const [, next] = highlight.tokensOf('TS', ['const a = \'b', 'stop();']);

    expect(next).toEqual([{text: 'stop', kind: 'call'}, {text: '();', kind: 'plain'}]);
  });

  it('reads a quote at the start of a line as a string, whatever the line before ends with', () => {
    const [, next] = highlight.tokensOf('TS', ['f(a)', '\'b\'']);

    expect(next).toEqual([{text: '\'b\'', kind: 'string'}]);
  });

  it('reads a capital on the line after a colon as a value, not a type', () => {
    const [, next] = highlight.tokensOf('TS', ['const a = b ? c :', 'Fallback;']);

    expect(next).toEqual([{text: 'Fallback;', kind: 'plain'}]);
  });

  it('opens an element after a space, as in prose', () => {
    expect(kinds('TS', 'see <b>x').b).toBe('tag');
  });

  it('opens an element after punctuation', () => {
    expect(kinds('TS', 'f(<b>x').b).toBe('tag');
  });

  it('opens no element right after a name, where it is a generic', () => {
    expect(kinds('TS', 'Promise<b>').b).toBeUndefined();
  });

  it('reads type parameters that extend a type as code', () => {
    expect(kinds('TS', 'const f = <T extends string>(x: T) => x;').T).not.toBe('tag');
  });

  it('reads type parameters with a trailing comma as code', () => {
    expect(kinds('TS', 'const f = <T,>(x: T) => x;').T).not.toBe('tag');
  });

  it('reads type parameters before an arrow function\'s parameters as code', () => {
    expect(kinds('TS', 'const f = <T>(x: T) => x;').T).not.toBe('tag');
  });

  it('reads const type parameters as code, and the line after them too', () => {
    expect(constOnTheLineAfter('const f = <const T extends string>(x: T) => x;')).toBe('keyword');
  });

  it('reads in type parameters as code, and the line after them too', () => {
    expect(constOnTheLineAfter('const f = <in T>(x: T) => x;')).toBe('keyword');
  });

  it('reads out type parameters as code, and the line after them too', () => {
    expect(constOnTheLineAfter('const f = <out T>(x: T) => x;')).toBe('keyword');
  });

  it('reads a backtick inside a regular expression as part of it, and the line after it as code', () => {
    expect(constOnTheLineAfter('const re = /[`]/;')).toBe('keyword');
  });

  it('reads a comment opener inside a regular expression as part of it, and the line after it as code', () => {
    expect(constOnTheLineAfter('const re = /\\/*x/;')).toBe('keyword');
  });

  it('reads an escaped slash inside a regular expression as part of it, and the line after it as code', () => {
    expect(constOnTheLineAfter('const re = /\\/`/;')).toBe('keyword');
  });

  it('reads a tag inside a regular expression as part of it, and the line after it as code', () => {
    expect(constOnTheLineAfter('const re = /<b>/;')).toBe('keyword');
  });

  it('reads a slash inside a regular expression\'s class as part of it, and the line after it as code', () => {
    expect(constOnTheLineAfter('const re = /[/]`/;')).toBe('keyword');
  });

  it('ends a regular expression\'s class at its bracket, so a string after it is a string', () => {
    expect(kinds('TS', 'const re = /[a]/, s = \'x\';')['\'x\'']).toBe('string');
  });

  it('reads a block comment just inside an object\'s brace as a comment, and the line after it as code', () => {
    expect(constOnTheLineAfter('const o = {/* none */ a: 1};')).toBe('keyword');
  });

  it('reads a quote after a greater-than as a string', () => {
    expect(kinds('TS', 'if (x > \'a\') go();')['\'a\'']).toBe('string');
  });

  it('opens an element right after a word when it has an attribute', () => {
    expect(kinds('TS', 'Home<b title="x">').b).toBe('tag');
  });

  it('opens an element right after a word when it closes itself', () => {
    expect(kinds('TS', 'City<b/>').b).toBe('tag');
  });

  it('opens an element right after a word in JSX text', () => {
    expect(kinds('TS', '<p>x<b>').b).toBe('tag');
  });

  it('reads a block comment in code as a comment', () => {
    expect(kinds('TS', 'go(/* soon */);')['/* soon */']).toBe('comment');
  });

  it('reads a greater-than inside an attribute\'s braces as code, not the end of the tag', () => {
    expect(kinds('TS', '<b hidden={a > 1} id="x">').id).toBe('attribute');
  });

  it('keeps an object\'s closing brace from ending an attribute\'s braces', () => {
    expect(kinds('TS', '<b hidden={{a: 1}.a > 0} id="x">').id).toBe('attribute');
  });

  it('reads code inside JSX text\'s braces', () => {
    expect(kinds('TS', "<p>see {'x'}")["'x'"]).toBe('string');
  });

  it('reads code again after a self-closing element', () => {
    expect(kinds('TS', "const a = <b/>; const c = 'd';")["'d'"]).toBe('string');
  });

  it('reads code again after an element closes', () => {
    expect(kinds('TS', "const a = <b>x</b>; const c = 'd';")["'d'"]).toBe('string');
  });

  it('closes an element anywhere a closing tag stands', () => {
    expect(kinds('TS', 'onClick={go}>×</button>').button).toBe('tag');
  });

  it('reads a double-quoted string after punctuation as a string', () => {
    expect(kinds('TS', 'f("a")')['"a"']).toBe('string');
  });

  it('keeps slashes, a tag and a brace inside a string one string', () => {
    expect(kinds('TS', "const said = 'a // b /* c <p> {d}';")["'a // b /* c <p> {d}'"]).toBe('string');
  });

  it('keeps a quote, a backtick and a tag inside a line comment one comment', () => {
    expect(kinds('TS', "const at = 0; // it's `<p>")["// it's `<p>"]).toBe('comment');
  });

  it('keeps a JSX comment after JSX text that says for \'em a comment', () => {
    expect(kinds('TS', "<p>for 'em</p>{/* note */}")['{/* note */}']).toBe('comment');
  });

  it('keeps a double quote in markup text from opening a string', () => {
    expect(highlight.tokensOf('HTML', ['<p>say "hi"</p><b>it\'s</b>']).flat().map(({kind}) => kind)).not.toContain('string');
  });
});

describe('the code voice, line by line', () => {
  const rejoined = (label: 'HTML' | 'CSS' | 'TS', lines: string[]): string[] =>
    highlight.tokensOf(label, lines).map(line => line.map(({text}) => text).join(''));

  it('rejoins a TS sample\'s tokens into its lines, a template that crosses them included', () => {
    const lines = ['const said = `first', 'second`;', '', '// done'];
    expect(rejoined('TS', lines)).toEqual(lines);
  });

  it('rejoins an HTML sample\'s tokens into its lines', () => {
    const lines = ['<p class="said">', '  it\'s "here"', '</p>'];
    expect(rejoined('HTML', lines)).toEqual(lines);
  });

  it('rejoins a CSS sample\'s tokens into its lines', () => {
    const lines = ['a {', '  color: red;', '}'];
    expect(rejoined('CSS', lines)).toEqual(lines);
  });

  it('gives an empty line no tokens', () => {
    expect(highlight.tokensOf('TS', ['const a = 1;', '', 'const b = 2;'])[1]).toEqual([]);
  });
});
