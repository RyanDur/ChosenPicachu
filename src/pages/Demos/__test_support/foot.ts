import {screen, within} from '@testing-library/react';

export const pageFoot = {
  leadsOn: async (): Promise<(string | null)[][]> =>
    within(await screen.findByRole('navigation', {name: 'Parts, in order'})).getAllByRole('link')
      .map(link => [link.textContent, link.getAttribute('href')])
};
