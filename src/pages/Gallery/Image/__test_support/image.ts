import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Shown = {title: string; altText: string};

const loading = {name: 'loading'};

export const imageOf = ({title, altText}: Shown) => {
  const link = (): HTMLElement => screen.getByRole('link', {name: title});
  return {
    loading: (): HTMLElement => screen.getByRole('progressbar', loading),
    loadingIfAny: (): HTMLElement | null => screen.queryByRole('progressbar', loading),
    pictureIfAny: (): HTMLElement | null => screen.queryByAltText(altText),
    link,
    linkIfAny: (): HTMLElement | null => screen.queryByRole('link', {name: title}),
    standInIfAny: (): HTMLElement | null => screen.queryByAltText(/would not load|has nothing to show/),
    nothingToShow: (): HTMLElement => screen.getByAltText(`${title} has nothing to show`),
    open: (): Promise<void> => userEvent.click(link())
  };
};
