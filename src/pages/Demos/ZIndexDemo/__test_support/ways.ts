import {within} from '@testing-library/react';

export const wayLabelled = (figure: HTMLElement, label: string): HTMLElement | undefined => within(figure).getAllByRole('listitem')
  .filter(item => within(item).queryByText(label, {exact: true}) !== null).pop();
