import {highlight, Label} from '../highlight';

const typeScript = import.meta.glob<string>(['/src/**/*.{ts,tsx}', '!**/__tests__/**'], {query: '?raw', import: 'default', eager: true});
const markup = import.meta.glob<string>('/src/**/*.html', {query: '?raw', import: 'default', eager: true});

const endsOpen = (label: Label) => ([, text]: [string, string]): boolean => {
  const probed = highlight.tokensOf(label, [...text.split('\n').map(line => line.trimStart()), 'probe']);
  return probed[probed.length - 1].some(({kind}) => kind === 'string' || kind === 'comment');
};

describe('every source file a sample is carved from', () => {
  it('scans to its end outside a string, a template literal and a block comment', () => {
    const open = [
      ...Object.entries(typeScript).filter(endsOpen('TS')),
      ...Object.entries(markup).filter(endsOpen('HTML'))
    ].map(([path]) => path);

    expect(open).toEqual([]);
  });
});
