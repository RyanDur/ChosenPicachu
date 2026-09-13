import {screen, within} from '@testing-library/react';

export const tableControls = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});

export const chosenDials = async (): Promise<string[]> =>
  within(await tableControls()).getAllByRole<HTMLInputElement>('radio', {checked: true}).map(radio => radio.labels?.[0]?.textContent ?? '');
