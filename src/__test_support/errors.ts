import {screen, within} from '@testing-library/react';

export const appErrors = {
  reported: async (): Promise<string[]> =>
    (await within(await screen.findByRole('list', {name: 'errors reported'})).findAllByRole('listitem')).map(item => item.textContent)
};
