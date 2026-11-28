import {within} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';

export const listings = {
  heads: (holder: HTMLElement): string[] => within(holder).getAllByRole('figure')
    .map(figure => computeAccessibleName(figure))
    .filter(name => name.includes(' · ')),
  workingCode: (holder: HTMLElement): (string | null)[][] =>
    within(within(holder).getByText(/^The working code on the site:/)).getAllByRole('link')
      .map(link => [link.textContent, link.getAttribute('href')])
};
