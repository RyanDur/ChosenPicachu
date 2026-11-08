import {screen} from '@testing-library/react';
import {gallerySettings} from '@pages/Gallery/__test_support';
import userEvent from '@testing-library/user-event';

const pageField = (): HTMLElement => gallerySettings().getByRole('spinbutton', {name: /Page #/});
const sizeField = (): HTMLElement => gallerySettings().getByRole('spinbutton', {name: /Per Page/});

export const pageControl = {
  pageField,
  pageFieldSaysAppears: (page: number): Promise<HTMLElement> => gallerySettings().findByRole('spinbutton', {name: `Page #${page}`}),
  typePage: (page: string): Promise<void> => userEvent.type(pageField(), page),
  rubOutPage: (): Promise<void> => userEvent.clear(pageField()),
  typeSize: (size: string): Promise<void> => userEvent.type(sizeField(), size),
  go: (): Promise<void> => userEvent.click(gallerySettings().getByRole('button', {name: 'Go'})),
  nextPage: (): Promise<void> => userEvent.click(screen.getByRole('link', {name: 'NEXT'}))
};
