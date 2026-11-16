import {excerpts} from '../excerpts';
import {lines} from '../lines';
import {CodeFile, Line} from '../sample';

const store: CodeFile = {path: 'src/store.ts', url: 'https://github.com/RyanDur/ChosenPicachu/blob/main/src/store.ts'};
const shared: CodeFile = {path: 'src/shared.ts', url: 'https://github.com/RyanDur/ChosenPicachu/blob/main/src/shared.ts'};

const carved = (text: string, file: CodeFile, line: number): Line => ({text, from: {file, line}});

const kindOfConst = (tokens: {text: string; kind: string}[]): string | undefined =>
  tokens.find(({text}) => text === 'const')?.kind;

describe('the code voice, excerpt by excerpt', () => {
  it('leaves a dim line plain', () => {
    const [aside] = excerpts.tokensOf('TS', [lines.aside('const a = 1;')]);
    expect(aside).toEqual([{text: 'const a = 1;', kind: 'plain'}]);
  });

  it('starts the line after a dim line fresh', () => {
    const [, , after] = excerpts.tokensOf('TS', [lines.plain('return <ul>'), lines.aside('…'), lines.plain('export const a = 1;')]);
    expect(kindOfConst(after)).toBe('keyword');
  });

  it('reads written lines that follow each other as one excerpt', () => {
    const [, closing] = excerpts.tokensOf('TS', [lines.plain('const s = `a'), lines.plain('b`;')]);
    expect(closing).toEqual([{text: 'b`', kind: 'string'}, {text: ';', kind: 'plain'}]);
  });

  it('reads carved lines that follow each other in their file as one excerpt', () => {
    const [, closing] = excerpts.tokensOf('TS', [carved('const s = `a', store, 1), carved('b`;', store, 2)]);
    expect(closing).toEqual([{text: 'b`', kind: 'string'}, {text: ';', kind: 'plain'}]);
  });

  it('starts a carved line fresh when it skips lines of its file', () => {
    const [, after] = excerpts.tokensOf('TS', [carved('return <ul>', store, 1), carved('const a = 1;', store, 5)]);
    expect(kindOfConst(after)).toBe('keyword');
  });

  it('starts a carved line fresh when it comes from another file', () => {
    const [, after] = excerpts.tokensOf('TS', [carved('return <ul>', store, 1), carved('const a = 1;', shared, 2)]);
    expect(kindOfConst(after)).toBe('keyword');
  });

  it('starts a carved line fresh after a written one', () => {
    const [, after] = excerpts.tokensOf('TS', [lines.plain('return <ul>'), carved('const a = 1;', store, 2)]);
    expect(kindOfConst(after)).toBe('keyword');
  });

  it('starts a written line fresh after a carved one', () => {
    const [, after] = excerpts.tokensOf('TS', [carved('return <ul>', store, 1), lines.plain('const a = 1;')]);
    expect(kindOfConst(after)).toBe('keyword');
  });

  it('reads a carved line that starts inside its file\'s template as that template\'s end', () => {
    const styles: CodeFile = {...store, text: 'const a = 1;\nconst sheet = css`\n`;\nexport const b = 2;'};
    const [, , , after] = excerpts.tokensOf('TS', [
      carved('const a = 1;', styles, 1), lines.aside('…'), carved('`;', styles, 3), carved('export const b = 2;', styles, 4)
    ]);
    expect(kindOfConst(after)).toBe('keyword');
  });
});
