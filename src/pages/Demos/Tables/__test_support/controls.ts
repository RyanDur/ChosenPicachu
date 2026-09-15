import {screen, within} from '@testing-library/react';

const region = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});

export const tableControls = {
  region,
  chosenDials: async (): Promise<string[]> =>
    within(await region()).getAllByRole<HTMLInputElement>('radio', {checked: true}).map(radio => radio.labels?.[0]?.textContent ?? '')
};
