import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExclusiveCheckboxToggleAccordion, ExclusiveRadioToggleAccordion} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

describe('the exclusive toggle accordions', () => {
  test('each checkbox is named by the fold it opens', async () => {
    render(<ExclusiveCheckboxToggleAccordion content={folds}/>);

    expect(screen.getByRole('checkbox', {name: 'Alpha Open'})).toBeInTheDocument();
    expect(screen.getByRole('checkbox', {name: 'Beta Open'})).toBeInTheDocument();

    await userEvent.click(screen.getByRole('checkbox', {name: 'Alpha Open'}));

    expect(screen.getByRole('checkbox', {name: 'Alpha Close'})).toBeChecked();
  });

  test('each radio is named by the fold it opens', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds}/>);

    expect(screen.getByRole('radio', {name: 'Beta Open'})).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', {name: 'Beta Open'}));

    expect(screen.getByRole('radio', {name: 'Beta Close'})).toBeChecked();
  });

  test('the animation style is chosen from a named group, not a bare pair of radios', () => {
    render(<ExclusiveRadioToggleAccordion content={folds}/>);

    expect(screen.getByRole('group', {name: 'animation style'})).toBeInTheDocument();
  });
});
