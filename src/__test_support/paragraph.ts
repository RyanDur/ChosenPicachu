import {screen} from '@testing-library/react';

export const paragraphOpening = (opening: RegExp): HTMLElement => {
  const found = screen.getAllByRole('paragraph').find(paragraph => opening.test(paragraph.textContent ?? ''));
  if (found) {
    return found;
  }
  throw new Error(`no paragraph opening ${opening}`);
};
