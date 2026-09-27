import type {Locator, Page} from '@playwright/test';

export type Build = 'the checkbox build' | 'the radio build' | 'the details build' | 'the React checkbox build' | 'the React radio build';

export const builds: Build[] = ['the checkbox build', 'the radio build', 'the details build', 'the React checkbox build', 'the React radio build'];

const headings: Record<Build, string> = {
  'the checkbox build': 'Accordion using checkboxes',
  'the radio build': 'Accordion using a radio group',
  'the details build': 'Exclusive accordion using details elements',
  'the React checkbox build': 'Exclusive accordion using checkboxes',
  'the React radio build': 'Exclusive accordion using radio group'
};

type Part = {fold: Locator; open: () => Promise<void>; isOpen: () => Promise<boolean>};

const wordOn = (part: Locator): Locator => part.getByText(/^\w+$/).first();

export const textOf = (part: Locator): Locator => part.getByRole('paragraph', {includeHidden: true});

const firstParts: Record<Build, (build: Locator) => Part> = {
  'the checkbox build': build => {
    const fold = build.getByRole('listitem').first();
    return {fold, open: () => wordOn(fold).click(), isOpen: () => fold.getByRole('checkbox').isChecked()};
  },
  'the radio build': build => {
    const partAfterTheCloseBar = build.getByRole('listitem').nth(1);
    return {fold: partAfterTheCloseBar, open: () => wordOn(partAfterTheCloseBar).click(), isOpen: () => partAfterTheCloseBar.getByRole('radio').isChecked()};
  },
  'the details build': build => {
    const fold = build.getByRole('group').first();
    return {fold, open: () => wordOn(fold).click(), isOpen: () => fold.evaluate(details => details.hasAttribute('open'))};
  },
  'the React checkbox build': build => {
    const fold = build.getByRole('listitem').first();
    return {fold, open: () => fold.getByText('Open', {exact: true}).click(), isOpen: () => fold.getByRole('checkbox').isChecked()};
  },
  'the React radio build': build => {
    const fold = build.getByRole('listitem').first();
    return {fold, open: () => fold.getByText('Open', {exact: true}).click(), isOpen: () => fold.getByRole('radio').isChecked()};
  }
};

export const accordionsTab = (page: Page) => {
  const built = (build: Build): Locator =>
    page.getByRole('article').filter({has: page.getByRole('heading', {name: headings[build], exact: true})}).first();
  return {
    partsOf: (build: Build): Locator => build === 'the details build' ? built(build).getByRole('group') : built(build).getByRole('listitem'),
    open: (part: Locator): Promise<void> => wordOn(part).click(),
    openByKeyboard: async (part: Locator): Promise<void> => {
      await wordOn(part).focus();
      await page.keyboard.press('Enter');
    },
    firstPartOf: (build: Build): Part => firstParts[build](built(build))
  };
};
