import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Headers = {
  readonly columns: HTMLElement[];
  readonly rows: HTMLElement[];
};

export const dragSortTab = {
  recipe: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'build the native drag sort yourself'}),
  tableIn: (holder: HTMLElement, name: string): Headers => {
    const table = within(holder).getByRole('table', {name});
    return {columns: within(table).getAllByRole('columnheader'), rows: within(table).getAllByRole('rowheader')};
  },
  pressWords: async (holder: HTMLElement, told: RegExp): Promise<void> => userEvent.click(within(holder).getByText(told)),
  chooseIn: async (holder: HTMLElement, name: string): Promise<void> => userEvent.click(within(holder).getByRole('radio', {name}))
};
