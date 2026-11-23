import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Headers = {
  readonly columns: HTMLElement[];
  readonly rows: HTMLElement[];
};

export const dragSortTab = {
  exhibit: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'Three items to put in order'}),
  recipe: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'build the native drag sort yourself'}),
  cluesIn: (holder: HTMLElement): Headers => {
    const table = within(holder).getByRole('table', {name: 'the clues'});
    return {columns: within(table).getAllByRole('columnheader'), rows: within(table).getAllByRole('rowheader')};
  },
  press: async (holder: HTMLElement, told: RegExp): Promise<void> => userEvent.click(within(holder).getByText(told)),
  chooseIn: async (holder: HTMLElement, name: string): Promise<void> => userEvent.click(within(holder).getByRole('radio', {name}))
};
