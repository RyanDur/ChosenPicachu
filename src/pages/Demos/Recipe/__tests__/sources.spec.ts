import {highlight} from '../highlight';

const typeScript = import.meta.glob<string>(['/src/**/*.{ts,tsx}', '!**/__tests__/**'], {query: '?raw', import: 'default', eager: true});
const markup = import.meta.glob<string>('/src/**/*.html', {query: '?raw', import: 'default', eager: true});

const linesOf = (text: string): string[] => text.split('\n').map(line => line.trimStart());

const endsOutsideCode = ([, text]: [string, string]): boolean => {
  const probed = highlight.tokensOf('TS', [...linesOf(text), 'const probe = 1;']);
  return probed[probed.length - 1].find(({text: word}) => word === 'const')?.kind !== 'keyword';
};

const endsInAStringOrComment = ([, text]: [string, string]): boolean => {
  const probed = highlight.tokensOf('HTML', [...linesOf(text), 'probe']);
  return probed[probed.length - 1].some(({kind}) => kind === 'string' || kind === 'comment');
};

describe('every source file a sample is carved from', () => {
  it('scans each TypeScript file to its end in code', () => {
    expect(Object.entries(typeScript).filter(endsOutsideCode).map(([path]) => path)).toEqual([]);
  });

  it('scans each markup file to its end outside a string and a comment', () => {
    expect(Object.entries(markup).filter(endsInAStringOrComment).map(([path]) => path)).toEqual([]);
  });
});
