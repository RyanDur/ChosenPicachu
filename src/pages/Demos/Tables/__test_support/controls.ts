import {screen} from '@testing-library/react';

export const tableControls = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'table controls'}, {timeout: 5000});
