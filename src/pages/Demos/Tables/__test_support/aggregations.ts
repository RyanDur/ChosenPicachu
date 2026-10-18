import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {untilTheTablesTabRenders} from './controls';

const card = (): HTMLElement => screen.getByRole('region', {name: 'live aggregations'});

export const aggregations = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'live aggregations'}, untilTheTablesTabRenders),
  card,
  counted: async (trades: number): Promise<HTMLElement[]> => within(card()).findAllByText(String(trades)),
  columns: (): (string | null)[] => within(card()).getAllByRole('columnheader').map(header => header.getAttribute('aria-label')),
  windows: (): (string | null)[] => within(card()).getAllByRole('rowheader').map(header => header.textContent),
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
