import {is} from '@ryandur/sand';
import {within} from '@testing-library/react';

export const wayLabelled = (figure: HTMLElement, label: string): HTMLElement | undefined => within(figure).getAllByRole('listitem')
  .filter(item => is(within(item).queryByText(label, {exact: true}))).pop();
