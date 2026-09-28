import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExclusiveRadioToggleAccordion, InclusiveCheckboxToggleAccordion} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

const controlOf = (control: 'checkbox' | 'radio', part: string): HTMLElement =>
  screen.getByRole(control, {name: new RegExp(`${part}$`)});

describe('the inclusive toggle accordion using checkboxes', () => {
  test('should keep every fold it opens open', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    await userEvent.click(controlOf('checkbox', 'Alpha'));
    await userEvent.click(controlOf('checkbox', 'Beta'));

    expect(controlOf('checkbox', 'Alpha')).toBeChecked();
    expect(controlOf('checkbox', 'Beta')).toBeChecked();
  });

  test('should close only the fold whose control is pressed again', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);
    await userEvent.click(controlOf('checkbox', 'Alpha'));
    await userEvent.click(controlOf('checkbox', 'Beta'));

    await userEvent.click(controlOf('checkbox', 'Alpha'));

    expect(controlOf('checkbox', 'Alpha')).not.toBeChecked();
    expect(controlOf('checkbox', 'Beta')).toBeChecked();
  });
});

describe('the exclusive toggle accordion using a radio group', () => {
  test('should open one fold at a time', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    await userEvent.click(controlOf('radio', 'Alpha'));
    await userEvent.click(controlOf('radio', 'Beta'));

    expect(controlOf('radio', 'Beta')).toBeChecked();
    expect(controlOf('radio', 'Alpha')).not.toBeChecked();
  });

  test('should close the open fold when its radio is pressed again', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await userEvent.click(controlOf('radio', 'Beta'));

    await userEvent.click(controlOf('radio', 'Beta'));

    expect(controlOf('radio', 'Beta')).not.toBeChecked();
    expect(controlOf('radio', 'Alpha')).not.toBeChecked();
  });

  test('should open a fold again after its radio closed it', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await userEvent.click(controlOf('radio', 'Beta'));
    await userEvent.click(controlOf('radio', 'Beta'));

    await userEvent.click(controlOf('radio', 'Beta'));

    expect(controlOf('radio', 'Beta')).toBeChecked();
  });

  test('should open a fold again after another fold opened in its place', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await userEvent.click(controlOf('radio', 'Alpha'));
    await userEvent.click(controlOf('radio', 'Beta'));

    await userEvent.click(controlOf('radio', 'Alpha'));

    expect(controlOf('radio', 'Alpha')).toBeChecked();
    expect(controlOf('radio', 'Beta')).not.toBeChecked();
  });

  test('should close the open fold when the space bar goes down on its radio, with no click after', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await userEvent.click(controlOf('radio', 'Alpha'));

    fireEvent.keyDown(controlOf('radio', 'Alpha'), {key: ' '});

    expect(controlOf('radio', 'Alpha')).not.toBeChecked();
  });
});
