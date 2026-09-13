import {screen} from '@testing-library/react';

export const wallHangs = (): Promise<HTMLElement[]> => screen.findAllByRole('figure');
