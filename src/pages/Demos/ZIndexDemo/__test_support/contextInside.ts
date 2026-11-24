import {screen} from '@testing-library/react';

const named = {name: 'A context inside a context'};

export const contextInside = {
  find: (): Promise<HTMLElement> => screen.findByRole('figure', named)
};
