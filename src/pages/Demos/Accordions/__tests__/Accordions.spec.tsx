import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExclusiveCheckboxToggleAccordion, ExclusiveRadioToggleAccordion} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

const toggles = [
  {accordion: 'checkboxes', Accordion: ExclusiveCheckboxToggleAccordion, control: 'checkbox' as const},
  {accordion: 'radios', Accordion: ExclusiveRadioToggleAccordion, control: 'radio' as const}
];

describe.each(toggles)('the exclusive toggle accordion using $accordion', ({Accordion, control}) => {
  const fold = (name: string): HTMLElement => {
    const found = screen.getAllByRole('listitem').find(item => within(item).queryByRole('heading', {name}));
    if (found) return found;
    throw new Error(`no fold named ${name}`);
  };
  const controlOf = (name: string, reads: 'Open' | 'Close'): HTMLElement =>
    within(fold(name)).getByRole(control, {name: reads});

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
