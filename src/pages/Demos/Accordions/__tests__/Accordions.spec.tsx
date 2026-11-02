import {render} from '@testing-library/react';
import {
  ExclusiveAccordion,
  ExclusiveMeasuredAccordion,
  ExclusiveRadioToggleAccordion,
  InclusiveAccordion,
  InclusiveCheckboxToggleAccordion,
  InclusiveMeasuredAccordion
} from '../Accordions';
import {accordionFolds, foldTextUnder} from '../__test_support/build';

const folds = [{key: 'Alpha', value: 'the first fold'}, {key: 'Beta', value: 'the second fold'}];

describe('the inclusive toggle accordion using checkboxes', () => {
  const accordion = accordionFolds('checkbox');

  test('should keep every fold it opens open', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    await accordion.press('Alpha');
    await accordion.press('Beta');

    expect(accordion.isOpen('Alpha')).toBe(true);
    expect(accordion.isOpen('Beta')).toBe(true);
  });

  test('should close only the fold whose control is pressed again', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);
    await accordion.press('Alpha');
    await accordion.press('Beta');

    await accordion.press('Alpha');

    expect(accordion.isOpen('Alpha')).toBe(false);
    expect(accordion.isOpen('Beta')).toBe(true);
  });

  test('should leave the fold as it was when the reader presses the fold’s name', async () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    await accordion.pressName('Alpha');

    expect(accordion.isOpen('Alpha')).toBe(false);
  });

  test('should hold its controls in one group named folds', () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    expect(accordion.controls()).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<InclusiveCheckboxToggleAccordion content={folds} motion="reveal"/>);

    expect(accordion.articles()).toHaveLength(1);
    expect(accordion.items()).toHaveLength(folds.length);
  });
});

describe('the exclusive toggle accordion using a radio group', () => {
  const accordion = accordionFolds('radio');

  test('should open one fold at a time', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    await accordion.press('Alpha');
    await accordion.press('Beta');

    expect(accordion.isOpen('Beta')).toBe(true);
    expect(accordion.isOpen('Alpha')).toBe(false);
  });

  test('should close the open fold when its radio is pressed again', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordion.press('Beta');

    await accordion.press('Beta');

    expect(accordion.isOpen('Beta')).toBe(false);
    expect(accordion.isOpen('Alpha')).toBe(false);
  });

  test('should open a fold again after its radio closed it', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordion.press('Beta');
    await accordion.press('Beta');

    await accordion.press('Beta');

    expect(accordion.isOpen('Beta')).toBe(true);
  });

  test('should open a fold again after another fold opened in its place', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordion.press('Alpha');
    await accordion.press('Beta');

    await accordion.press('Alpha');

    expect(accordion.isOpen('Alpha')).toBe(true);
    expect(accordion.isOpen('Beta')).toBe(false);
  });

  test('should close the open fold when the space bar goes down on its radio, with no click after', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);
    await accordion.press('Alpha');

    await accordion.holdSpace();

    expect(accordion.isOpen('Alpha')).toBe(false);
  });

  test('should leave the fold as it was when the reader presses the fold’s name', async () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    await accordion.pressName('Alpha');

    expect(accordion.isOpen('Alpha')).toBe(false);
  });

  test('should hold its controls in one group named folds', () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    expect(accordion.controls()).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<ExclusiveRadioToggleAccordion content={folds} motion="reveal"/>);

    expect(accordion.articles()).toHaveLength(1);
    expect(accordion.items()).toHaveLength(folds.length);
  });
});

describe('the accordion using checkboxes', () => {
  const accordion = accordionFolds('checkbox');

  test('should hold its controls in one group named folds', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordion.controls()).toHaveLength(folds.length);
  });

  test('should make each fold an item of its list, with no article of its own', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordion.articles()).toHaveLength(1);
    expect(accordion.items()).toHaveLength(folds.length);
  });
});

describe('the accordion using a radio group', () => {
  const accordion = accordionFolds('radio');

  test('should hold its controls, the Close bar’s among them, in one group named folds', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordion.controls()).toHaveLength(folds.length + 1);
  });

  test('should make each fold, and the Close bar, an item of its list, with no article of its own', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(accordion.articles()).toHaveLength(1);
    expect(accordion.items()).toHaveLength(folds.length + 1);
  });
});

describe('the builds we used to make', () => {
  test('should name each fold’s text by its bar in the checkbox build', () => {
    render(<InclusiveAccordion content={folds} motion="reveal"/>);

    expect(foldTextUnder('Alpha')).toHaveTextContent('the first fold');
    expect(foldTextUnder('Beta')).toHaveTextContent('the second fold');
  });

  test('should name each fold’s text by its bar in the radio build', () => {
    render(<ExclusiveAccordion content={folds} motion="reveal"/>);

    expect(foldTextUnder('Alpha')).toHaveTextContent('the first fold');
    expect(foldTextUnder('Beta')).toHaveTextContent('the second fold');
  });

  test('should name each fold’s text by its bar in the measured checkbox build', () => {
    render(<InclusiveMeasuredAccordion content={folds} motion="reveal"/>);

    expect(foldTextUnder('Alpha')).toHaveTextContent('the first fold');
    expect(foldTextUnder('Beta')).toHaveTextContent('the second fold');
  });

  test('should name each fold’s text by its bar in the measured radio build', () => {
    render(<ExclusiveMeasuredAccordion content={folds} motion="reveal"/>);

    expect(foldTextUnder('Alpha')).toHaveTextContent('the first fold');
    expect(foldTextUnder('Beta')).toHaveTextContent('the second fold');
  });
});
