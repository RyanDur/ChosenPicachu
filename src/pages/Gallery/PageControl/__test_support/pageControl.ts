import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const pageField = (): HTMLElement => screen.getByLabelText(/Page #/);
const sizeField = (): HTMLElement => screen.getByLabelText(/Per Page/);

export const pageControl = {
  pageField,
  pageFieldSaysAppears: (page: number): Promise<HTMLElement> => screen.findByLabelText(`Page #${page}`),
  typePage: (page: string): Promise<void> => userEvent.type(pageField(), page),
  rubOutPage: (): Promise<void> => userEvent.clear(pageField()),
  typeSize: (size: string): Promise<void> => userEvent.type(sizeField(), size),
  go: (): Promise<void> => userEvent.click(screen.getByRole('button', {name: 'Go'})),
  nextPage: (): Promise<void> => userEvent.click(screen.getByRole('link', {name: 'NEXT'})),
  addressSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  addressSearchAppears: (): Promise<HTMLElement> => screen.findByRole('status', {name: 'url search'})
};
