import {screen} from '@testing-library/react';

export const decodedParams = {
  read: (): unknown => JSON.parse(screen.getByRole('status', {name: 'decoded'}).textContent)
};
