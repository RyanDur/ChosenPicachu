import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExclusiveAccordion, ExclusiveRadioToggleAccordion, InclusiveAccordion, InclusiveCheckboxToggleAccordion} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

const controlOf = (control: 'checkbox' | 'radio', part: string): HTMLElement =>
  screen.getByRole(control, {name: part});

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

    await userEvent.keyboard('[Space>]');

    expect(controlOf('radio', 'Alpha')).not.toBeChecked();
  });
});

describe.each([
  {accordion: 'the accordion using checkboxes', Accordion: InclusiveAccordion, control: 'checkbox' as const, controls: folds.length, items: folds.length},
  {accordion: 'the accordion using a radio group', Accordion: ExclusiveAccordion, control: 'radio' as const, controls: folds.length + 1, items: folds.length + 1},
  {accordion: 'the inclusive toggle accordion using checkboxes', Accordion: InclusiveCheckboxToggleAccordion, control: 'checkbox' as const, controls: folds.length, items: folds.length},
  {accordion: 'the exclusive toggle accordion using a radio group', Accordion: ExclusiveRadioToggleAccordion, control: 'radio' as const, controls: folds.length, items: folds.length}
])('$accordion', ({Accordion, control, controls, items}) => {
  test('should hold its controls in one group named parts', () => {
    render(<Accordion content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('group', {name: 'parts'})).getAllByRole(control)).toHaveLength(controls);
  });

  test('should make each part an item of its list, with no article of its own', () => {
    render(<Accordion content={folds} motion="reveal"/>);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(within(screen.getByRole('group', {name: 'parts'})).getAllByRole('listitem')).toHaveLength(items);
  });
});

describe('the builds we used to make', () => {
  test.each([
    {build: 'checkbox', Build: InclusiveAccordion},
    {build: 'radio', Build: ExclusiveAccordion}
  ])('should name each part’s text by its bar in the $build build', ({Build}) => {
    render(<Build content={folds} motion="reveal"/>);

    expect(within(screen.getByRole('region', {name: 'Alpha'})).getByText('the first fold')).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'Beta'})).getByText('the second fold')).toBeInTheDocument();
  });
});
