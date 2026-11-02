import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ExclusiveAccordion,
  ExclusiveMeasuredAccordion,
  ExclusiveRadioToggleAccordion,
  InclusiveAccordion,
  InclusiveCheckboxToggleAccordion,
  InclusiveMeasuredAccordion
} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

const controlOf = (control: 'checkbox' | 'radio', fold: string): HTMLElement =>
  screen.getByRole(control, {name: new RegExp(fold)});

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

  test('should leave the fold as it was when the reader presses the fold’s name', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    await userEvent.click(screen.getAllByText('Alpha')[0]);

    expect(controlOf('checkbox', 'Alpha')).not.toBeChecked();
  });

  test('should hold its controls in one group named folds', () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('checkbox')).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('listitem')).toHaveLength(folds.length);
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

    await userEvent.keyboard('[Space>]');

    expect(controlOf('radio', 'Alpha')).not.toBeChecked();
  });

  test('should leave the fold as it was when the reader presses the fold’s name', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    await userEvent.click(screen.getAllByText('Alpha')[0]);

    expect(controlOf('radio', 'Alpha')).not.toBeChecked();
  });

  test('should hold its controls in one group named folds', () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('radio')).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('listitem')).toHaveLength(folds.length);
  });
});

describe('the accordion using checkboxes', () => {
  test('should hold its controls in one group named folds', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('checkbox')).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('listitem')).toHaveLength(folds.length);
  });
});

describe('the accordion using a radio group', () => {
  test('should hold its controls, the Close bar’s among them, in one group named folds', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('radio')).toHaveLength(folds.length + 1);
  });

  test('should make each fold, and the Close bar, an item of its list, with no article of its own', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(within(screen.getByRole('group', {name: 'folds'})).getAllByRole('listitem')).toHaveLength(folds.length + 1);
  });
});

describe('the builds we used to make', () => {
  test('should name each fold’s text by its bar in the checkbox build', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('region', {name: 'Alpha'})).getByText('the first fold')).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'Beta'})).getByText('the second fold')).toBeInTheDocument();
  });

  test('should name each fold’s text by its bar in the radio build', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('region', {name: 'Alpha'})).getByText('the first fold')).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'Beta'})).getByText('the second fold')).toBeInTheDocument();
  });

  test('should name each fold’s text by its bar in the measured checkbox build', () => {
    render(<InclusiveMeasuredAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('region', {name: 'Alpha'})).getByText('the first fold')).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'Beta'})).getByText('the second fold')).toBeInTheDocument();
  });

  test('should name each fold’s text by its bar in the measured radio build', () => {
    render(<ExclusiveMeasuredAccordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('region', {name: 'Alpha'})).getByText('the first fold')).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'Beta'})).getByText('the second fold')).toBeInTheDocument();
  });
});
