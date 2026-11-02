import {within} from '@testing-library/react';
import {maybe} from '@ryandur/sand';

export const readingOf = (controls: HTMLElement, dial: string): HTMLElement =>
  maybe(within(controls).getAllByRole('listitem').find(row => within(row).queryByRole('group', {name: dial}) !== null)).either(
    row => within(row).getByRole('status'),
    () => {
      throw new Error(`no dial named ${dial}`);
    });
