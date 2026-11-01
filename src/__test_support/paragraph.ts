import {screen} from '@testing-library/react';

export const paragraphOpening = (opening: RegExp): HTMLElement => {
  const found = screen.getAllByRole('paragraph').filter(paragraph => opening.test(paragraph.textContent ?? ''));
  if (found.length === 1) {
    return found[0];
  }
  throw new Error(`${found.length} paragraphs opening ${opening}, not one`);
};

export const paragraphReading = (text: string): HTMLElement => {
  const found = screen.getAllByRole('paragraph').find(paragraph => paragraph.textContent === text);
  if (found) {
    return found;
  }
  throw new Error(`no paragraph reading ${text}`);
};
