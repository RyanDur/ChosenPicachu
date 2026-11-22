import {screen, waitFor, within} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';
import userEvent from '@testing-library/user-event';
import {sortableTable} from '@components/DragSortableTable/__test_support';
import {broadcast, Feed} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support/subscription';
import {untilTheTablesTabRenders} from './controls';

const card = (): HTMLElement => screen.getByRole('region', {name: 'live aggregations'});

const arrived = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'live aggregations'}, untilTheTablesTabRenders);

const rowOf = (lookback: string): HTMLElement => within(card()).getByRole('row', {name: new RegExp(`^${lookback}`)});

const afterItsFirstTrade = async (feed: Feed, trade: string): Promise<void> => {
  await feedIsSubscribed(feed);
  await arrived();
  broadcast(feed, [trade]);
  await waitFor(() => {
    if (sortableTable.texts(rowOf('this minute'))[1] !== '1') {
      throw new Error('the first trade has not reached this minute');
    }
  });
};

const cellOf = (lookback: string, measure: string): HTMLElement => {
  const measures = within(card()).getAllByRole('columnheader').map(header => header.getAttribute('aria-label'));
  const row = rowOf(lookback);
  return within(row).getAllByRole('cell')[measures.indexOf(measure) - 1];
};

export const aggregations = {
  arrived,
  afterItsFirstTrade,
  card,
  header: (measure: string): HTMLElement => within(card()).getByRole('columnheader', {name: new RegExp(`^${measure}`)}),
  rows: (): HTMLElement[] => within(card()).getAllByRole('row'),
  row: rowOf,
  findRow: (lookback: string): Promise<HTMLElement> => within(card()).findByRole('row', {name: new RegExp(`^${lookback}`)}),
  counted: async (trades: number): Promise<HTMLElement[]> => within(card()).findAllByText(String(trades)),
  columns: (): (string | null)[] => within(card()).getAllByRole('columnheader').map(header => header.getAttribute('aria-label')),
  markOn: (lookback: string, measure: string): string => cellOf(lookback, measure).dataset.moved ?? 'none',
  spokenIn: (lookback: string, measure: string): string => computeAccessibleName(cellOf(lookback, measure)),
  lookbacks: (): (string | null)[] => within(card()).getAllByRole('rowheader').map(header => header.textContent),
  moveWindowByKey: async (row: number, key: string): Promise<void> => {
    within(card()).getByRole('button', {name: `move row ${row}`}).focus();
    await userEvent.keyboard(key);
  },
  moveColumnByKey: async (measure: string, key: string): Promise<void> => {
    within(card()).getByRole('columnheader', {name: new RegExp(`^${measure}`)}).focus();
    await userEvent.keyboard(key);
  },
  sort: async (measure: string, direction: 'ascending' | 'descending'): Promise<void> =>
    userEvent.click(within(within(card()).getByLabelText(`sort ${measure} by`)).getByRole('button', {name: direction, hidden: true}))
};
