import {has, not} from '@ryandur/sand';
import {scan} from './type-script-scan';
import {typeScriptWords} from './type-script-words';

export type Kind = 'plain' | 'keyword' | 'string' | 'number' | 'comment' | 'tag' | 'attribute' | 'type' | 'call';

export type Token = {
  text: string;
  kind: Kind;
};

type Found = {
  start: number;
  length: number;
  kind: Kind;
};

type TokenPattern = {pattern: RegExp; kind: Kind};

const matchesOf = (line: string, tokenPatterns: ReadonlyArray<TokenPattern>, taken: Found[],
  allowed: (start: number, end: number) => boolean): Found[] => {
  const found = [...taken];
  tokenPatterns.forEach(tokenPattern => {
    for (const match of line.matchAll(tokenPattern.pattern)) {
      const start = match.index;
      const overlaps = found.some(other =>
        start < other.start + other.length && other.start < start + match[0].length);
      if (not(overlaps) && has(match[0]) && allowed(start, start + match[0].length)) {
        found.push({start, length: match[0].length, kind: tokenPattern.kind});
      }
    }
  });
  return found;
};

const tokensFrom = (line: string, found: Found[]): Token[] => {
  const tokens: Token[] = [];
  let at = 0;
  [...found].sort((left, right) => left.start - right.start).forEach(({start, length, kind}) => {
    if (start > at) {
      tokens.push({text: line.slice(at, start), kind: 'plain'});
    }
    tokens.push({text: line.slice(start, start + length), kind});
    at = start + length;
  });
  if (at < line.length) {
    tokens.push({text: line.slice(at), kind: 'plain'});
  }
  return tokens;
};

const tokensMatching = (line: string, tokenPatterns: ReadonlyArray<TokenPattern>): Token[] =>
  tokensFrom(line, matchesOf(line, tokenPatterns, [], () => true));

const typeScriptPatterns: ReadonlyArray<TokenPattern> = [
  {pattern: /(?<=\w<)[A-Z]\w*(?=,|>[(;)=])/g, kind: 'type'},
  {pattern: new RegExp(`\\b(?:${typeScriptWords.colored.join('|')})\\b`, 'g'), kind: 'keyword'},
  {pattern: /(?<=:[ \t]*)(?:readonly\s+)?[A-Z]\w*(?=[[<,;)=\s|]|$)/g, kind: 'type'},
  {pattern: /(?<=\b(?:type|extends|new)[ \t]+)[A-Z]\w*/g, kind: 'type'},
  {pattern: /(?<=<)[A-Z]\w*|(?<=, )[A-Z]\w*(?=>)/g, kind: 'type'},
  {pattern: /\b[a-zA-Z_$][\w$]*(?=\()/g, kind: 'call'},
  {pattern: /\b\d+(?:\.\d+)?\b/g, kind: 'number'}
];

const typeScript = (text: string): Token[] => {
  const {runs, isCode} = scan.typeScript(text);
  return tokensFrom(text, matchesOf(text, typeScriptPatterns, runs,
    (start, end) => isCode.slice(start, end).every(Boolean)));
};

const css: ReadonlyArray<TokenPattern> = [
  {pattern: /\/\*.*?\*\//g, kind: 'comment'},
  {pattern: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, kind: 'string'},
  {pattern: /@[\w-]+/g, kind: 'keyword'},
  {pattern: /^[ \t]*[^:;{}@][^:;{}]*(?=\s*\{)/g, kind: 'tag'},
  {pattern: /^[ \t]*[.&][^:;{}]*,$/g, kind: 'tag'},
  {pattern: /(?<![\w-])-?\d+(?:\.\d+)?[a-z%]*/g, kind: 'number'},
  {pattern: /(?<=^[ \t]*)[a-z-]+(?=\s*:)/gm, kind: 'attribute'},
  {pattern: /[a-z-]+(?=\()/g, kind: 'call'}
];

const markup = (text: string): Token[] => {
  const {runs} = scan.markup(text);
  return tokensFrom(text, matchesOf(text, [{pattern: /\b\d+(?:\.\d+)?\b/g, kind: 'number'}], runs, () => true));
};

const linesOf = (tokens: Token[]): Token[][] => tokens.reduce<Token[][]>((lines, {text, kind}) => {
  text.split('\n').forEach((piece, at) => {
    if (at > 0) lines.push([]);
    if (has(piece)) lines[lines.length - 1].push({text: piece, kind});
  });
  return lines;
}, [[]]);

const wholeSample = (grammar: (text: string) => Token[]) =>
  (lines: readonly string[]): Token[][] => linesOf(grammar(lines.join('\n')));

const grammars = {
  TS: wholeSample(typeScript),
  CSS: (lines: readonly string[]) => lines.map(line => tokensMatching(line, css)),
  HTML: wholeSample(markup)
};

export type Label = keyof typeof grammars;

type Highlight = {
  tokensOf: (label: Label, lines: readonly string[]) => Token[][];
};

export const highlight: Highlight = {
  tokensOf: (label, lines) => grammars[label](lines)
};
