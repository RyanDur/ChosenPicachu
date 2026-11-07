import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Shown = {title: string; altText: string};

export const imageOf = ({title, altText}: Shown) => ({
  loadingIfAny: (): HTMLElement | null => screen.queryByRole('progressbar', {name: 'loading'}),
  pictureIfAny: (): HTMLElement | null => screen.queryByAltText(altText),
  link: (): HTMLElement => screen.getByRole('link', {name: title}),
  standInIfAny: (): HTMLElement | null => screen.queryByAltText(/would not load|has nothing to show/),
  nothingToShow: (): HTMLElement => screen.getByAltText(`${title} has nothing to show`),
  open: (): Promise<void> => userEvent.click(screen.getByAltText(altText)),
  urlPath: (): HTMLElement => screen.getByRole('status', {name: 'url path'})
});
