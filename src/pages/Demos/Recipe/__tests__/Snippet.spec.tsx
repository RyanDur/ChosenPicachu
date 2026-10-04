import {render, screen, within} from '@testing-library/react';
import {Snippet} from '../Snippet';
import {aside, plain} from '../lines';
import {span} from '../carve';
import {aSample} from '../__test_support';

const store = aSample('export const store = 1;\nexport const more = 2;\n', 'src/pages/Demos/store.ts');
const shared = aSample('export type Store = {};\n', 'src/components/store.ts');

describe('a code sample', () => {
  test('should name the file it was taken from, and link to it on GitHub', () => {
    render(<Snippet label="TS" lines={span(store, 'export const store', 'export const more')}/>);

    expect(screen.getByRole('link', {name: 'Demos/store.ts on GitHub'})).toHaveAttribute('href', store.url);
  });

  test('should link each file it was taken from, in the order they first appear', () => {
    render(<Snippet label="TS" lines={[
      ...span(shared, 'export type Store', 'export type Store'), plain(' '),
      ...span(store, 'export const store', 'export const store'),
      ...span(shared, 'export type Store', 'export type Store')
    ]}/>);

    expect(within(screen.getByRole('figure')).getAllByRole('link').map(({textContent}) => textContent))
      .toEqual(['components/store.ts on GitHub', 'Demos/store.ts on GitHub']);
  });

  test('should say so when it was written for the page and not taken from the code', () => {
    render(<Snippet label="CSS" lines={[plain('.fold {'), aside('/* written here */'), plain('}')]}/>);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('figure')).toHaveTextContent('Written for this page, not taken from the site’s code.');
  });

  test('should show a file directly under src with its folder', () => {
    const sheet = aSample('.x {}\n', 'src/index.css');
    render(<Snippet label="CSS" lines={span(sheet, '.x {', '.x {')}/>);

    expect(screen.getByRole('link', {name: 'src/index.css on GitHub'})).toBeInTheDocument();
  });
});
