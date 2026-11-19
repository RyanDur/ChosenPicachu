import {screen, within} from '@testing-library/react';

const namesAndAddressesIn = (holder: HTMLElement): (string | null)[][] =>
  within(holder).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);

export const chartPage = {
  storyHeading: (description: string): Promise<HTMLElement> =>
    screen.findByRole('heading', {name: description.replace(/\.$/, '')}),
  partsIn: (index: HTMLElement): (string | null)[][] => namesAndAddressesIn(index)
};
