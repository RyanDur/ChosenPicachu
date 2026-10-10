import {screen, within} from '@testing-library/react';

export const itemHeadedBy = (list: string, heading: string): HTMLElement => {
  const item = within(screen.getByRole('list', {name: list})).getAllByRole('listitem')
    .find(candidate => within(candidate).queryByRole('heading', {name: heading}) !== null);
  if (item) {
    return item;
  }
  throw new Error(`no item in ${list} headed ${heading}`);
};
