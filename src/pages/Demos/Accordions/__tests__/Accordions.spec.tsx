import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExclusiveCheckboxToggleAccordion, ExclusiveRadioToggleAccordion, InclusiveCheckboxToggleAccordion} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

const toggles = [
  {accordion: 'checkboxes', Accordion: ExclusiveCheckboxToggleAccordion, control: 'checkbox' as const},
  {accordion: 'radios', Accordion: ExclusiveRadioToggleAccordion, control: 'radio' as const}
];

describe.each(toggles)('the exclusive toggle accordion using $accordion', ({Accordion, control}) => {
  const controlOf = (name: string, reads: 'Open' | 'Close'): HTMLElement =>
    screen.getByRole(control, {name: `${reads} ${name}`});

  test('should open one fold at a time', async () => {
    render(<Accordion content={folds}/>);

    await userEvent.click(controlOf('Alpha', 'Open'));
    expect(controlOf('Alpha', 'Close')).toBeChecked();
    expect(controlOf('Beta', 'Open')).not.toBeChecked();

    await userEvent.click(controlOf('Beta', 'Open'));
    expect(controlOf('Beta', 'Close')).toBeChecked();
    expect(controlOf('Alpha', 'Open')).not.toBeChecked();
  });

  test('should close the open fold when its own control is pressed again', async () => {
    render(<Accordion content={folds}/>);
    await userEvent.click(controlOf('Beta', 'Open'));

    await userEvent.click(controlOf('Beta', 'Close'));

    expect(controlOf('Beta', 'Open')).not.toBeChecked();
    expect(controlOf('Alpha', 'Open')).not.toBeChecked();
  });

});

describe('the inclusive toggle accordion using checkboxes', () => {
  const controlOf = (name: string, reads: 'Open' | 'Close'): HTMLElement =>
    screen.getByRole('checkbox', {name: `${reads} ${name}`});

  test('should keep every fold it opens open', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds}/>);

    await userEvent.click(controlOf('Alpha', 'Open'));
    await userEvent.click(controlOf('Beta', 'Open'));

    expect(controlOf('Alpha', 'Close')).toBeChecked();
    expect(controlOf('Beta', 'Close')).toBeChecked();
  });

  test('should close only the fold whose control is pressed again', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds}/>);
    await userEvent.click(controlOf('Alpha', 'Open'));
    await userEvent.click(controlOf('Beta', 'Open'));

    await userEvent.click(controlOf('Alpha', 'Close'));

    expect(controlOf('Alpha', 'Open')).not.toBeChecked();
    expect(controlOf('Beta', 'Close')).toBeChecked();
  });
});

describe.each([
  {accordion: 'the inclusive toggle accordion using checkboxes', Accordion: InclusiveCheckboxToggleAccordion, control: 'checkbox' as const},
  ...toggles.map(toggle => ({...toggle, accordion: `the exclusive toggle accordion using ${toggle.accordion}`}))
])('$accordion', ({Accordion, control}) => {
  test('offers Animate and Static as its animation style, chosen with the keyboard', async () => {
    render(<Accordion content={folds}/>);
    const style = screen.getByRole('group', {name: 'animation style'});
    expect(within(style).getByRole('radio', {name: 'Animate'})).toBeChecked();

    within(style).getByRole('radio', {name: 'Animate'}).focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(within(style).getByRole('radio', {name: 'Static'})).toBeChecked();
  });

  test('should keep the open fold open when the reader changes how folds move', async () => {
    render(<Accordion content={folds}/>);
    await userEvent.click(screen.getByRole(control, {name: 'Open Beta'}));

    await userEvent.click(within(screen.getByRole('group', {name: 'animation style'})).getByRole('radio', {name: 'Static'}));

    expect(screen.getByRole(control, {name: 'Close Beta'})).toBeChecked();
  });
});
