import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ExclusiveCheckboxToggleAccordion, ExclusiveRadioToggleAccordion} from '../Accordions';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

const toggles = [
  {accordion: 'checkboxes', Accordion: ExclusiveCheckboxToggleAccordion, control: 'checkbox' as const},
  {accordion: 'radios', Accordion: ExclusiveRadioToggleAccordion, control: 'radio' as const}
];

describe.each(toggles)('the exclusive toggle accordion using $accordion', ({Accordion, control}) => {
  const open = () => screen.getAllByRole(control, {name: 'Open'});
  const close = () => screen.getAllByRole(control, {name: 'Close'});

  test('should open one fold at a time', async () => {
    render(<Accordion content={folds}/>);
    expect(open()).toHaveLength(2);

    await userEvent.click(open()[0]);
    expect(close()).toHaveLength(1);
    expect(close()[0]).toBeChecked();

    await userEvent.click(open()[0]);
    expect(close()).toHaveLength(1);
    expect(open()).toHaveLength(1);
    expect(open()[0]).not.toBeChecked();
  });

  test('should close the open fold when its own control is pressed again', async () => {
    render(<Accordion content={folds}/>);
    await userEvent.click(open()[1]);

    await userEvent.click(close()[0]);

    expect(screen.queryAllByRole(control, {name: 'Close'})).toHaveLength(0);
    open().forEach(fold => expect(fold).not.toBeChecked());
  });
});
