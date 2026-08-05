export type Kind = 'plain' | 'key' | 'lit';

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
      if (!overlaps) {
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

const js: ReadonlyArray<{match: RegExp; kind: Kind}> = [
  {match: /'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"/g, kind: 'lit'},
  {match: /\b(?:const|let|return|if|else|new|function|undefined|true|false)\b/g, kind: 'key'},
  {match: /\b\d+(?:\.\d+)?\b/g, kind: 'lit'}
];

const css: ReadonlyArray<{match: RegExp; kind: Kind}> = [
  {match: /@[\w-]+/g, kind: 'key'},
  {match: /^\s*[a-z-]+(?=\s*:)/g, kind: 'key'},
  {match: /(?<=:\s*)[^;{}]+/g, kind: 'lit'},
  {match: /^[.&@:\w][^:{]*(?=,?\s*\{?$)/g, kind: 'key'}
];

const html: ReadonlyArray<{match: RegExp; kind: Kind}> = [
  {match: /'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"/g, kind: 'lit'},
  {match: /(?<=<\/?)[\w.-]+/g, kind: 'key'},
  {match: /[\w-]+(?==)/g, kind: 'key'}
];

const grammars = {JS: js, CSS: css, HTML: html};

export const highlight = (label: 'HTML' | 'CSS' | 'JS', line: string): Token[] =>
  scan(line, grammars[label]);
