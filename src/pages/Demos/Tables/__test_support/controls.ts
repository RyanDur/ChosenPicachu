import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const untilTheTablesTabRenders = {timeout: 5000};

const region = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'table controls'}, untilTheTablesTabRenders);

export const tableControls = {
  region,
  pressSettings: async (): Promise<void> => userEvent.click(await screen.findByText('settings', {}, untilTheTablesTabRenders)),
  chosenDials: async (): Promise<string[]> =>
    within(await region()).getAllByRole<HTMLInputElement>('radio', {checked: true}).map(radio => radio.labels?.[0]?.textContent ?? '')
};
