import {screen, within} from '@testing-library/react';

export const pageFoot = {
  leadsOn: async (name: string): Promise<(string | null)[][]> =>
    within(await screen.findByRole('navigation', {name})).getAllByRole('link')
      .map(link => [link.textContent, link.getAttribute('href')])
};
