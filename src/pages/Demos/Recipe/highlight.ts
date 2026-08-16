export type Kind = 'plain' | 'keyword' | 'string' | 'number' | 'comment' | 'tag';

export type Token = {
  text: string;
  kind: Kind;
};

type Found = {
  start: number;
  length: number;
  kind: Kind;
};

const scan = (line: string, patterns: ReadonlyArray<{match: RegExp; kind: Kind}>): Token[] => {
  const found: Found[] = [];
  patterns.forEach(({match, kind}) => {
    for (const hit of line.matchAll(match)) {
      const start = hit.index;
      const overlaps = found.some(taken =>
        start < taken.start + taken.length && taken.start < start + hit[0].length);
      if (!overlaps && hit[0].length > 0) {
        found.push({start, length: hit[0].length, kind});
      }
    }
  });
  found.sort((left, right) => left.start - right.start);
  const tokens: Token[] = [];
  let at = 0;
  found.forEach(({start, length, kind}) => {
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

const ts: ReadonlyArray<{match: RegExp; kind: Kind}> = [
  {match: /\/\/.*$/g, kind: 'comment'},
  {match: /'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"/g, kind: 'string'},
  {match: /\b(?:const|let|return|if|else|new|function|undefined|true|false)\b/g, kind: 'keyword'},
  {match: /\b\d+(?:\.\d+)?\b/g, kind: 'number'}
];

const css: ReadonlyArray<{match: RegExp; kind: Kind}> = [
  {match: /\/\*.*?\*\//g, kind: 'comment'},
  {match: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, kind: 'string'},
  {match: /@[\w-]+/g, kind: 'keyword'},
  {match: /^[ \t]*[^:;{}@][^:;{}]*(?=\s*\{)/g, kind: 'tag'},
  {match: /^[ \t]*[.&][^:;{}]*,$/g, kind: 'tag'},
  {match: /(?<![\w-])-?\d+(?:\.\d+)?[a-z%]*/g, kind: 'number'}
];

const html: ReadonlyArray<{match: RegExp; kind: Kind}> = [
  {match: /\{\/\*.*?\*\/\}/g, kind: 'comment'},
  {match: /'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"/g, kind: 'string'},
  {match: /(?<=<\/?)[\w.-]+/g, kind: 'tag'},
  {match: /\b\d+(?:\.\d+)?\b/g, kind: 'number'}
];

const grammars = {TS: ts, CSS: css, HTML: html};

export const highlight = (label: 'HTML' | 'CSS' | 'TS', line: string): Token[] =>
  scan(line, grammars[label]);
