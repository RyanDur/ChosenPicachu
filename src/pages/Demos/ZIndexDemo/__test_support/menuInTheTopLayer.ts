import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const exhibitRegion = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'The menu in the top layer'});

const raiseCardOne = async (): Promise<HTMLElement> =>
  within(await exhibitRegion()).getByRole('checkbox', {name: /Give card one z-index: 9999\.$/});

export const menuInTheTopLayer = {
  find: exhibitRegion,
  raiseCardOne,
  togglesCardOne: async (): Promise<void> => userEvent.click(await raiseCardOne()),
  whatTheListDid: async (): Promise<HTMLElement> =>
    within(await exhibitRegion()).getByRole('status', {name: 'what the list did'}),
  comparedWith: async (): Promise<HTMLElement> =>
    within(await exhibitRegion()).getByRole('status', {name: 'what the list is compared with'}),
  markedRules: async (): Promise<string[]> => {
    const [css] = within(await exhibitRegion()).getAllByRole('figure')
      .filter(sample => (sample.textContent ?? '').startsWith('CSS'));
    return within(css).queryAllByRole('mark').map(({textContent}) => (textContent ?? '').trim());
  }
};
