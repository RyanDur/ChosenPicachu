import {not, has} from '@ryandur/sand';
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

type Rule = {pattern: RegExp; kind: Kind} | {pattern: RegExp; groups: ReadonlyArray<Kind>};

const kindOf = (rule: Rule, match: RegExpExecArray): Kind => 'kind' in rule
  ? rule.kind
  : rule.groups.find(group => has(match.groups?.[group])) ?? 'plain';

const scan = (line: string, rules: ReadonlyArray<Rule>): Token[] => {
  const found: Found[] = [];
  rules.forEach(rule => {
    for (const match of line.matchAll(rule.pattern)) {
      const start = match.index;
      const overlaps = found.some(taken =>
        start < taken.start + taken.length && taken.start < start + match[0].length);
      if (not(overlaps) && has(match[0])) {
        found.push({start, length: match[0].length, kind: kindOf(rule, match)});
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

const keywords = [
  'const', 'let', 'return', 'if', 'else', 'new', 'function', 'undefined', 'true', 'false', 'null',
  'export', 'import', 'from', 'type', 'readonly', 'extends', 'typeof', 'in', 'of', 'as', 'void',
  'switch', 'case', 'default', 'throw', 'try', 'catch', 'finally', 'await', 'async', 'while', 'for', 'declare'
];

const stringOrComment =
  /(?<string>'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*")|(?<comment>\/\/.*$|\{\/\*.*?\*\/})/g;

const ts: ReadonlyArray<Rule> = [
  {pattern: stringOrComment, groups: ['string', 'comment']},
  {pattern: /(?<=\w<)[A-Z]\w*(?=,|>[(;)=])/g, kind: 'type'},
  {pattern: /(?<=<\/?)[A-Za-z][\w.]*/g, kind: 'tag'},
  {pattern: /(?<=<[A-Za-z][\w.]*\s[^>]*?)\b[a-zA-Z][\w-]*(?==)/g, kind: 'attribute'},
  {pattern: new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'g'), kind: 'keyword'},
  {pattern: /(?<=:\s*)(?:readonly\s+)?[A-Z]\w*(?=[[<,;)=\s|]|$)/g, kind: 'type'},
  {pattern: /(?<=\b(?:type|extends|new)\s+)[A-Z]\w*/g, kind: 'type'},
  {pattern: /(?<=<)[A-Z]\w*(?=[,>])|(?<=, )[A-Z]\w*(?=>)/g, kind: 'type'},
  {pattern: /\b[a-zA-Z_$][\w$]*(?=\()/g, kind: 'call'},
  {pattern: /\b\d+(?:\.\d+)?\b/g, kind: 'number'}
];

const css: ReadonlyArray<Rule> = [
  {pattern: /\/\*.*?\*\//g, kind: 'comment'},
  {pattern: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, kind: 'string'},
  {pattern: /@[\w-]+/g, kind: 'keyword'},
  {pattern: /^[ \t]*[^:;{}@][^:;{}]*(?=\s*\{)/g, kind: 'tag'},
  {pattern: /^[ \t]*[.&][^:;{}]*,$/g, kind: 'tag'},
  {pattern: /(?<![\w-])-?\d+(?:\.\d+)?[a-z%]*/g, kind: 'number'},
  {pattern: /(?<=^[ \t]*)[a-z-]+(?=\s*:)/gm, kind: 'attribute'},
  {pattern: /[a-z-]+(?=\()/g, kind: 'call'}
];

const html: ReadonlyArray<Rule> = [
  {pattern: /\{\/\*.*?\*\/}|<!--.*?-->/g, kind: 'comment'},
  {pattern: /'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"/g, kind: 'string'},
  {pattern: /(?<=<\/?)[\w.-]+/g, kind: 'tag'},
  {pattern: /(?<=<[\w.-]+\s[^>]*?)\b[a-zA-Z][\w-]*(?==)/g, kind: 'attribute'},
  {pattern: /\b\d+(?:\.\d+)?\b/g, kind: 'number'}
];

const grammars = {TS: ts, CSS: css, HTML: html};

type Highlight = {
  tokensOf: (label: keyof typeof grammars, line: string) => Token[];
};

export const highlight: Highlight = {
  tokensOf: (label, line) => scan(line, grammars[label])
};
