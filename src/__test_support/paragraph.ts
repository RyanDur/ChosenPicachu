import {screen, within} from '@testing-library/react';

export const paragraphOpeningIn = (container: HTMLElement) => (opening: RegExp): HTMLElement => {
  const found = within(container).getAllByRole('paragraph').filter(paragraph => opening.test(paragraph.textContent ?? ''));
  if (found.length === 1) {
    return found[0];
  }
  throw new Error(`${found.length} paragraphs opening ${opening}, not one`);
};

export const paragraphOpening = (opening: RegExp): HTMLElement => paragraphOpeningIn(document.body)(opening);

export const paragraphReading = (text: string): HTMLElement => {
  const found = screen.getAllByRole('paragraph').find(paragraph => paragraph.textContent === text);
  if (found) {
    return found;
  }
  throw new Error(`no paragraph reading ${text}`);
};
