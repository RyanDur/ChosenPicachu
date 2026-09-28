import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExclusiveCheckboxToggleAccordion, ExclusiveRadioToggleAccordion, InclusiveCheckboxToggleAccordion} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

const controlOf = (control: 'checkbox' | 'radio', name: string, reads: 'Open' | 'Close'): HTMLElement =>
  screen.getByRole(control, {name: `${reads} ${name}`});

const toggles = [
  {accordion: 'checkboxes', Accordion: ExclusiveCheckboxToggleAccordion, control: 'checkbox' as const},
  {accordion: 'radios', Accordion: ExclusiveRadioToggleAccordion, control: 'radio' as const}
];

describe.each(toggles)('the exclusive toggle accordion using $accordion', ({Accordion, control}) => {
  test('should open one fold at a time', async () => {
    render(<Accordion content={folds}/>);

    await userEvent.click(controlOf(control, 'Alpha', 'Open'));
    expect(controlOf(control, 'Alpha', 'Close')).toBeChecked();
    expect(controlOf(control, 'Beta', 'Open')).not.toBeChecked();

    await userEvent.click(controlOf(control, 'Beta', 'Open'));
    expect(controlOf(control, 'Beta', 'Close')).toBeChecked();
    expect(controlOf(control, 'Alpha', 'Open')).not.toBeChecked();
  });

  test('should close the open fold when its own control is pressed again', async () => {
    render(<Accordion content={folds}/>);
    await userEvent.click(controlOf(control, 'Beta', 'Open'));

    await userEvent.click(controlOf(control, 'Beta', 'Close'));

    expect(controlOf(control, 'Beta', 'Open')).not.toBeChecked();
    expect(controlOf(control, 'Alpha', 'Open')).not.toBeChecked();
  });

});

describe('the inclusive toggle accordion using checkboxes', () => {
  test('should keep every fold it opens open', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds}/>);

    await userEvent.click(controlOf('checkbox', 'Alpha', 'Open'));
    await userEvent.click(controlOf('checkbox', 'Beta', 'Open'));

    expect(controlOf('checkbox', 'Alpha', 'Close')).toBeChecked();
    expect(controlOf('checkbox', 'Beta', 'Close')).toBeChecked();
  });

  test('should close only the fold whose control is pressed again', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds}/>);
    await userEvent.click(controlOf('checkbox', 'Alpha', 'Open'));
    await userEvent.click(controlOf('checkbox', 'Beta', 'Open'));

    await userEvent.click(controlOf('checkbox', 'Alpha', 'Close'));

    expect(controlOf('checkbox', 'Alpha', 'Open')).not.toBeChecked();
    expect(controlOf('checkbox', 'Beta', 'Close')).toBeChecked();
  });
});

describe.each([
  {accordion: 'the inclusive toggle accordion using checkboxes', Accordion: InclusiveCheckboxToggleAccordion, control: 'checkbox' as const},
  ...toggles.map(toggle => ({...toggle, accordion: `the exclusive toggle accordion using ${toggle.accordion}`}))
])('$accordion', ({Accordion, control}) => {
  test('should offer Animate and Static as its animation style, chosen with the keyboard', async () => {
    render(<Accordion content={folds}/>);
    const style = screen.getByRole('group', {name: 'animation style'});
    expect(within(style).getByRole('radio', {name: 'Animate'})).toBeChecked();

    within(style).getByRole('radio', {name: 'Animate'}).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(within(style).getByRole('radio', {name: 'Static'})).toBeChecked();
  });

  test('should keep the open fold open when the reader changes how folds move', async () => {
    render(<Accordion content={folds}/>);
    await userEvent.click(controlOf(control, 'Beta', 'Open'));

    await userEvent.click(within(screen.getByRole('group', {name: 'animation style'})).getByRole('radio', {name: 'Static'}));

    expect(controlOf(control, 'Beta', 'Close')).toBeChecked();
  });
});
