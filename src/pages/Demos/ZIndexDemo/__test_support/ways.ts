import {is} from '@ryandur/sand';
import {within} from '@testing-library/react';

export const wayLabeled = (figure: HTMLElement, label: string): HTMLElement | undefined => within(figure).getAllByRole('listitem')
  .filter(item => is(within(item).queryByText(label, {exact: true}))).pop();
