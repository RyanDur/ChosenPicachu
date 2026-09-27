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

export type Part = {
  fold: Locator;
  open: () => Promise<void>;
  openByKeyboard: () => Promise<void>;
  isOpen: () => Promise<boolean>;
};

const wordOn = (fold: Locator): Locator => fold.getByText(/^\w+$/).first();

const pressed = async (page: Page, control: Locator, key: string): Promise<void> => {
  await control.focus();
  await page.keyboard.press(key);
};

const kinds: Record<Build, (page: Page, fold: Locator) => Part> = {
  'the checkbox build': (page, fold) => ({
    fold,
    open: () => wordOn(fold).click(),
    openByKeyboard: () => pressed(page, fold.getByRole('checkbox'), 'Space'),
    isOpen: () => fold.getByRole('checkbox').isChecked()
  }),
  'the radio build': (page, fold) => ({
    fold,
    open: () => wordOn(fold).click(),
    openByKeyboard: () => pressed(page, fold.getByRole('radio'), 'Space'),
    isOpen: () => fold.getByRole('radio').isChecked()
  }),
  'the details build': (page, fold) => ({
    fold,
    open: () => wordOn(fold).click(),
    openByKeyboard: () => pressed(page, wordOn(fold), 'Enter'),
    isOpen: () => fold.evaluate(details => details.hasAttribute('open'))
  }),
  'the React checkbox build': (page, fold) => ({
    fold,
    open: () => fold.getByText('Open', {exact: true}).click(),
    openByKeyboard: () => pressed(page, fold.getByRole('checkbox'), 'Space'),
    isOpen: () => fold.getByRole('checkbox').isChecked()
  }),
  'the React radio build': (page, fold) => ({
    fold,
    open: () => fold.getByText('Open', {exact: true}).click(),
    openByKeyboard: () => pressed(page, fold.getByRole('radio'), 'Space'),
    isOpen: () => fold.getByRole('radio').isChecked()
  })
};

const partsAfterTheCloseBar = (build: Build): number => build === 'the radio build' ? 1 : 0;

export const accordionsTab = (page: Page) => {
  const folds = (build: Build): Locator => {
    const built = page.getByRole('article').filter({has: page.getByRole('heading', {name: headings[build], exact: true})}).first();
    return build === 'the details build' ? built.getByRole('group') : built.getByRole('listitem');
  };
  const partOf = (build: Build, index: number): Part => kinds[build](page, folds(build).nth(index + partsAfterTheCloseBar(build)));
  return {
    partOf,
    firstPartOf: (build: Build): Part => partOf(build, 0),
    partsOf: async (build: Build): Promise<Part[]> =>
      (await folds(build).all()).slice(partsAfterTheCloseBar(build)).map(fold => kinds[build](page, fold))
  };
};

export const textOf = (part: Part): Locator => part.fold.getByRole('paragraph', {includeHidden: true});
