import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const exhibitFigure = (): Promise<HTMLElement> => screen.findByRole('figure', {name: 'The menu in the top layer'});

const raiseCardOne = async (): Promise<HTMLElement> =>
  within(await exhibitFigure()).getByRole('checkbox', {name: /Give card one z-index: 9999\.$/});

export const menuInTheTopLayer = {
  find: exhibitFigure,
  raiseCardOne,
  togglesCardOne: async (): Promise<void> => userEvent.click(await raiseCardOne()),
  markedRules: async (): Promise<string[]> => {
    const [css] = within(await exhibitFigure()).getAllByRole('figure')
      .filter(sample => (sample.textContent ?? '').startsWith('CSS'));
    return within(css).queryAllByRole('mark').map(({textContent}) => (textContent ?? '').trim());
  }
};
