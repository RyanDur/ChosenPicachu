import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const region = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});

export const tableControls = {
  region,
  pressSettings: async (): Promise<void> => userEvent.click(await screen.findByText('settings', {}, {timeout: 5000})),
  chosenDials: async (): Promise<string[]> =>
    within(await region()).getAllByRole<HTMLInputElement>('radio', {checked: true}).map(radio => radio.labels?.[0]?.textContent ?? '')
};
