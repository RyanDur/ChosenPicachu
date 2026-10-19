import {within} from '@testing-library/react';

export const sortableTable = {
  texts: (row: HTMLElement): (string | null)[] =>
    [within(row).getByRole('rowheader'), ...within(row).getAllByRole('cell')].map(cell => cell.textContent)
};
