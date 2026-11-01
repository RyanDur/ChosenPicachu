import {screen} from '@testing-library/react';

export const paragraphOpening = (opening: RegExp): HTMLElement => {
  const found = screen.getAllByRole('paragraph').find(paragraph => opening.test(paragraph.textContent ?? ''));
  if (found) {
    return found;
  }
  throw new Error(`no paragraph opening ${opening}`);
};

export const paragraphReading = (text: string): HTMLElement => {
  const found = screen.getAllByRole('paragraph').find(paragraph => paragraph.textContent === text);
  if (found) {
    return found;
  }
  throw new Error(`no paragraph reading ${text}`);
};
