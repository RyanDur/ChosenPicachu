import {screen, waitFor} from '@testing-library/react';
import {gallerySettings} from '@pages/Gallery/__test_support';
import userEvent from '@testing-library/user-event';

const pageField = (): HTMLElement => gallerySettings().getByRole('spinbutton', {name: 'Page'});
const sizeField = (): HTMLElement => gallerySettings().getByRole('spinbutton', {name: 'Per page'});

const typedOver = async (field: HTMLElement, words: string): Promise<void> => {
  await userEvent.clear(field);
  await userEvent.type(field, words);
};

export const pageControl = {
  pageField,
  sizeField,
  pageFieldHolds: (page: number): Promise<void> => waitFor(() => {
    const field = pageField();
    if (field instanceof HTMLInputElement && field.valueAsNumber === page) return;
    throw new Error(`the page field is not at ${page}`);
  }),
  typePage: (page: string): Promise<void> => typedOver(pageField(), page),
  rubOutPage: (): Promise<void> => userEvent.clear(pageField()),
  typeSize: (size: string): Promise<void> => typedOver(sizeField(), size),
  go: (): Promise<void> => userEvent.click(gallerySettings().getByRole('button', {name: 'Go'})),
  nextPage: (): Promise<void> => userEvent.click(screen.getByRole('link', {name: 'NEXT'}))
};
