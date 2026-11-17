import {is, maybe} from '@ryandur/sand';
import {within} from '@testing-library/react';

export const wayLabeled = (figure: HTMLElement, label: string): HTMLElement => maybe(within(figure).getAllByRole('listitem')
  .filter(item => is(within(item).queryByText(label, {exact: true}))).pop()).either(
  way => way,
  () => {
    throw new Error(`no way labeled ${label}`);
  });
