import {has, is} from '@ryandur/sand';

export type Ink = 'bracket' | 'tag' | 'attribute' | 'words';
export type Token = {readonly ink: Ink; readonly text: string};

const tokensOf = (line: string): readonly Token[] => [...line.trim().matchAll(/(<\/?)([a-z0-9]+)((?: [a-z]+(?:="[^"]*")?)*)(>)|([^<]+)/g)]
  .flatMap(([, openingBracket, tag, attributes, closingBracket, words]): Token[] => is(words)
    ? [{ink: 'words', text: words}]
    : ([
      {ink: 'bracket', text: openingBracket},
      {ink: 'tag', text: tag},
      {ink: 'attribute', text: attributes},
      {ink: 'bracket', text: closingBracket}
    ] satisfies Token[]).filter(({text}) => has(text)));

export const markup = {tokensOf};
