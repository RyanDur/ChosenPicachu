import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {render, screen, waitFor, within} from '@testing-library/react';
import {tradeHistoryAnswers, tradeHistoryUnreachable} from '@__test_support/server';
import {sortableTable} from '@components/DragSortableTable/__test_support';

const NOW = 1700000000000;

const recentTradesNewestFirst = [
  {trade_id: 4, price: '50004.00', size: '0.01', side: 'buy', time: new Date(NOW).toISOString()},
  {trade_id: 3, price: '50003.00', size: '0.05', side: 'buy', time: new Date(NOW - 3 * 60000).toISOString()},
  {trade_id: 2, price: '50002.00', size: '0.25', side: 'sell', time: new Date(NOW - 10 * 60000).toISOString()},
  {trade_id: 1, price: '50001.00', size: '0.10', side: 'buy', time: new Date(NOW - 30 * 60000).toISOString()}
];

describe('the windows hydrate from history', () => {
  test('a pull of recent trades fills the windows before the socket speaks', async () => {
    tradeHistoryAnswers(recentTradesNewestFirst);

    render(<TestApp at={demosAt('?tab=tables')}/>);

    const card = await screen.findByRole('region', {name: 'live aggregations'});
    const rowFor = (label: string) => within(card).getByRole('row', {name: new RegExp(`^${label}`)});
    await waitFor(() => expect(sortableTable.texts(rowFor('this minute'))).toEqual(
      ['this minute', '1', '1', '0', '0.01', '$50,004.00', '+$0.00']));
    expect(sortableTable.texts(rowFor('this hour'))).toEqual(
      ['this hour', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
  });

  test('a history that cannot be reached leaves the windows empty, and the page says so', async () => {
    tradeHistoryUnreachable();

    render(<TestApp at={demosAt('?tab=tables')}/>);

    const card = await screen.findByRole('region', {name: 'live aggregations'});
    expect(await within(card).findByText('session')).toBeVisible();
    const sessionRow = within(card).getByRole('row', {name: /^session/});
    expect(sessionRow).toHaveTextContent('0');
    expect(await within(screen.getByRole('alert', {hidden: true})).findByText('the trade history could not be reached')).toBeInTheDocument();
  });
});
