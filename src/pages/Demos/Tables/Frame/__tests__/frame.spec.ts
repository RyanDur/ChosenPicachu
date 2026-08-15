import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {wire} from '../frame';
import tableHtml from '../table.html?raw';

describe('the frame table sorts', () => {
  const windowNames = (): string[] =>
    screen.getAllByRole('rowheader').map(header => (header.textContent ?? '').trim());

  const sortMenu = (column: string) =>
    within(screen.getByRole('columnheader', {name: new RegExp(column)}));

  beforeEach(() => {
    document.body.innerHTML = tableHtml;
    wire(document);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('deals in birth order', () => {
    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
  });

  it('ranks by the chosen column and announces the rule', async () => {
    await userEvent.click(sortMenu('window').getByRole('button', {name: 'descending', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'this hour', 'session', 'last 5 minutes', 'last 15 minutes']);
    expect(screen.getByRole('columnheader', {name: /window/})).toHaveAttribute('aria-sort', 'descending');
    expect(sortMenu('window').getByRole('button', {name: 'sort window'})).toHaveTextContent('▼');
  });

  it('as dealt restores the birth order and withdraws the announcement', async () => {
    await userEvent.click(sortMenu('window').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('window').getByRole('button', {name: 'as dealt', hidden: true}));

    expect(windowNames()).toEqual(['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session']);
    expect(screen.getByRole('columnheader', {name: /window/})).not.toHaveAttribute('aria-sort');
    expect(sortMenu('window').getByRole('button', {name: 'sort window'})).toHaveTextContent('⇅');
  });

  it('a new rule releases the old column', async () => {
    await userEvent.click(sortMenu('window').getByRole('button', {name: 'ascending', hidden: true}));
    await userEvent.click(sortMenu('trades').getByRole('button', {name: 'descending', hidden: true}));

    expect(screen.getByRole('columnheader', {name: /window/})).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('columnheader', {name: /trades/})).toHaveAttribute('aria-sort', 'descending');
  });
});
