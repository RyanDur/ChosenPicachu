import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const untilTheTablesTabRenders = {timeout: 5000};

const region = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'table controls'}, untilTheTablesTabRenders);

export const tableControls = {
  region,
  shown: (): HTMLElement | null => screen.queryByRole('region', {name: 'table controls'}),
  settings: (): Promise<HTMLElement> => screen.findByRole('group', {name: 'settings'}, untilTheTablesTabRenders),
  readout: (table: string): HTMLElement => screen.getByText(table),
  axis: async (name: string): Promise<HTMLElement> => within(await region()).getByRole('group', {name}),
  radio: async (name: string): Promise<HTMLElement> => within(await region()).getByRole('radio', {name}),
  choose: async (...choices: string[]): Promise<void> => {
    for (const name of choices) {
      await userEvent.click(within(await region()).getByRole('radio', {name}));
    }
  },
  pressSettings: async (): Promise<void> => userEvent.click(await screen.findByText('settings', {}, untilTheTablesTabRenders)),
  chosenDials: async (): Promise<string[]> =>
    within(await region()).getAllByRole<HTMLInputElement>('radio', {checked: true}).map(radio => radio.labels?.[0]?.textContent ?? '')
};
