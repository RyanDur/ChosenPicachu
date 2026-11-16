import {within} from '@testing-library/react';

type CellShape = {
  tag: string;
  classes: string[];
  scope: string | null;
  buttons: (string | null)[];
};

type TableShape = {headers: CellShape[]; rows: CellShape[][]};

const described = (cell: HTMLElement): CellShape => ({
  tag: cell.tagName,
  classes: [...cell.classList].sort(),
  scope: cell.getAttribute('scope'),
  buttons: within(cell).queryAllByRole('button', {hidden: true}).map(button => button.getAttribute('aria-label'))
});

export const tableShape = {
  read: (root: HTMLElement): TableShape => {
    const [head, body] = within(root).getAllByRole('rowgroup', {hidden: true});
    return {
      headers: within(head).getAllByRole('columnheader', {hidden: true}).map(described),
      rows: within(body).getAllByRole('row', {hidden: true})
        .map(lane => [within(lane).getByRole('rowheader', {hidden: true}), ...within(lane).getAllByRole('cell', {hidden: true})].map(described))
    };
  }
};
