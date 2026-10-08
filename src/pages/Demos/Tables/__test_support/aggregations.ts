import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const card = (): HTMLElement => screen.getByRole('region', {name: 'live aggregations'});

export const aggregations = {
  card,
  counted: async (trades: number): Promise<HTMLElement[]> => within(card()).findAllByText(String(trades)),
  windows: (): (string | null)[] => within(card()).getAllByRole('rowheader').map(header => header.textContent),
  sort: async (measure: string, direction: 'ascending' | 'descending'): Promise<void> =>
    userEvent.click(within(within(card()).getByLabelText(`sort ${measure} by`)).getByRole('button', {name: direction, hidden: true}))
};
