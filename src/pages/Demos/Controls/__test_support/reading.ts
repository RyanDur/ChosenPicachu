import {within} from '@testing-library/react';
import {is, maybe} from '@ryandur/sand';

export const readingOf = (controls: HTMLElement, dial: string): HTMLElement =>
  maybe(within(controls).getAllByRole('listitem').find(row => is(within(row).queryByRole('group', {name: dial})))).either(
    row => within(row).getByRole('status'),
    () => {
      throw new Error(`no dial named ${dial}`);
    });
