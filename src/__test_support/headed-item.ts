import {screen, within} from '@testing-library/react';

export const itemHeadedBy = (list: string, heading: string): HTMLElement => {
  const item = within(screen.getByRole('list', {name: list})).getAllByRole('listitem')
    .find(candidate => within(candidate).queryAllByRole('heading').slice(0, 1).some(first => first.textContent === heading));
  if (item) {
    return item;
  }
  throw new Error(`no item in ${list} headed ${heading}`);
};
