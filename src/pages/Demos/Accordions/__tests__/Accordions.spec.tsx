import {render} from '@testing-library/react';
import {
  ExclusiveAccordion,
  ExclusiveMeasuredAccordion,
  ExclusiveRadioToggleAccordion,
  InclusiveAccordion,
  InclusiveCheckboxToggleAccordion,
  InclusiveMeasuredAccordion
} from '../Accordions';
import {accordionBuild} from '../__test_support/build';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

describe('the inclusive toggle accordion using checkboxes', () => {
  test('should keep every fold it opens open', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    await accordionBuild.press(accordionBuild.checkbox('Alpha'));
    await accordionBuild.press(accordionBuild.checkbox('Beta'));

    expect(accordionBuild.checkbox('Alpha')).toBeChecked();
    expect(accordionBuild.checkbox('Beta')).toBeChecked();
  });

  test('should close only the fold whose control is pressed again', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);
    await accordionBuild.press(accordionBuild.checkbox('Alpha'));
    await accordionBuild.press(accordionBuild.checkbox('Beta'));

    await accordionBuild.press(accordionBuild.checkbox('Alpha'));

    expect(accordionBuild.checkbox('Alpha')).not.toBeChecked();
    expect(accordionBuild.checkbox('Beta')).toBeChecked();
  });

  test('should leave the fold as it was when the reader presses the fold’s name', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    await accordionBuild.pressName('Alpha');

    expect(accordionBuild.checkbox('Alpha')).not.toBeChecked();
  });

  test('should hold its controls in one group named folds', () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.controlsInFolds('checkbox')).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.articles()).toHaveLength(1);
    expect(accordionBuild.itemsInFolds()).toHaveLength(folds.length);
  });
});

describe('the exclusive toggle accordion using a radio group', () => {
  test('should open one fold at a time', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    await accordionBuild.press(accordionBuild.radio('Alpha'));
    await accordionBuild.press(accordionBuild.radio('Beta'));

    expect(accordionBuild.radio('Beta')).toBeChecked();
    expect(accordionBuild.radio('Alpha')).not.toBeChecked();
  });

  test('should close the open fold when its radio is pressed again', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordionBuild.press(accordionBuild.radio('Beta'));

    await accordionBuild.press(accordionBuild.radio('Beta'));

    expect(accordionBuild.radio('Beta')).not.toBeChecked();
    expect(accordionBuild.radio('Alpha')).not.toBeChecked();
  });

  test('should open a fold again after its radio closed it', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordionBuild.press(accordionBuild.radio('Beta'));
    await accordionBuild.press(accordionBuild.radio('Beta'));

    await accordionBuild.press(accordionBuild.radio('Beta'));

    expect(accordionBuild.radio('Beta')).toBeChecked();
  });

  test('should open a fold again after another fold opened in its place', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordionBuild.press(accordionBuild.radio('Alpha'));
    await accordionBuild.press(accordionBuild.radio('Beta'));

    await accordionBuild.press(accordionBuild.radio('Alpha'));

    expect(accordionBuild.radio('Alpha')).toBeChecked();
    expect(accordionBuild.radio('Beta')).not.toBeChecked();
  });

  test('should close the open fold when the space bar goes down on its radio, with no click after', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordionBuild.press(accordionBuild.radio('Alpha'));

    await accordionBuild.holdSpace();

    expect(accordionBuild.radio('Alpha')).not.toBeChecked();
  });

  test('should leave the fold as it was when the reader presses the fold’s name', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    await accordionBuild.pressName('Alpha');

    expect(accordionBuild.radio('Alpha')).not.toBeChecked();
  });

  test('should hold its controls in one group named folds', () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.controlsInFolds('radio')).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.articles()).toHaveLength(1);
    expect(accordionBuild.itemsInFolds()).toHaveLength(folds.length);
  });
});

describe('the accordion using checkboxes', () => {
  test('should hold its controls in one group named folds', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.controlsInFolds('checkbox')).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.articles()).toHaveLength(1);
    expect(accordionBuild.itemsInFolds()).toHaveLength(folds.length);
  });
});

describe('the accordion using a radio group', () => {
  test('should hold its controls, the Close bar’s among them, in one group named folds', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.controlsInFolds('radio')).toHaveLength(folds.length + 1);
  });

  test('should make each fold, and the Close bar, an item of its list, with no article of its own', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.articles()).toHaveLength(1);
    expect(accordionBuild.itemsInFolds()).toHaveLength(folds.length + 1);
  });
});

describe('the builds we used to make', () => {
  test('should name each fold’s text by its bar in the checkbox build', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.textNamed('Alpha')).toHaveTextContent('the first fold');
    expect(accordionBuild.textNamed('Beta')).toHaveTextContent('the second fold');
  });

  test('should name each fold’s text by its bar in the radio build', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.textNamed('Alpha')).toHaveTextContent('the first fold');
    expect(accordionBuild.textNamed('Beta')).toHaveTextContent('the second fold');
  });

  test('should name each fold’s text by its bar in the measured checkbox build', () => {
    render(<InclusiveMeasuredAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.textNamed('Alpha')).toHaveTextContent('the first fold');
    expect(accordionBuild.textNamed('Beta')).toHaveTextContent('the second fold');
  });

  test('should name each fold’s text by its bar in the measured radio build', () => {
    render(<ExclusiveMeasuredAccordion content={folds} motion="reveal"/>);

    expect(accordionBuild.textNamed('Alpha')).toHaveTextContent('the first fold');
    expect(accordionBuild.textNamed('Beta')).toHaveTextContent('the second fold');
  });
});
