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
  showsText: () => Promise<boolean>;
  open: () => Promise<void>;
  openByKeyboard: () => Promise<void>;
  isOpen: () => Promise<boolean>;
};

const wordOn = (fold: Locator): Locator => fold.getByText(/^\w+$/).first();

const focusAndPress = async (page: Page, control: Locator, key: string, times = 1): Promise<void> => {
  await control.focus();
  for (let press = 0; press < times; press += 1) {
    await page.keyboard.press(key);
  }
};

type Where = {page: Page; fold: Locator; article: Locator; index: number};

const textShownIn = (fold: Locator) => async (): Promise<boolean> => {
  const text = fold.getByRole('paragraph', {includeHidden: true});
  if (!await text.isVisible()) {
    return false;
  }
  await text.scrollIntoViewIfNeeded();
  return text.evaluate(element => new Promise<boolean>(resolve => {
    const watch = new IntersectionObserver(([seen]) => {
      watch.disconnect();
      resolve(seen.intersectionRatio > 0);
    });
    watch.observe(element);
  }));
};

const partIn: Record<Build, (where: Where) => Part> = {
  'the checkbox build': ({page, fold}) => ({
    fold,
    showsText: textShownIn(fold),
    open: () => wordOn(fold).click(),
    openByKeyboard: () => focusAndPress(page, fold.getByRole('checkbox'), 'Space'),
    isOpen: () => fold.getByRole('checkbox').isChecked()
  }),
  'the radio build': ({page, fold, article, index}) => ({
    fold,
    showsText: textShownIn(fold),
    open: () => wordOn(fold).click(),
    openByKeyboard: () => focusAndPress(page, article.getByRole('radio', {name: 'Close', exact: true}), 'ArrowDown', index + 1),
    isOpen: () => fold.getByRole('radio').isChecked()
  }),
  'the details build': ({page, fold}) => ({
    fold,
    showsText: textShownIn(fold),
    open: () => wordOn(fold).click(),
    openByKeyboard: () => focusAndPress(page, wordOn(fold), 'Enter'),
    isOpen: () => fold.evaluate(details => details.hasAttribute('open'))
  }),
  'the React checkbox build': ({page, fold}) => ({
    fold,
    showsText: textShownIn(fold),
    open: () => fold.getByText('Open', {exact: true}).click(),
    openByKeyboard: () => focusAndPress(page, fold.getByRole('checkbox'), 'Space'),
    isOpen: () => fold.getByRole('checkbox').isChecked()
  }),
  'the React radio build': ({page, fold, article, index}) => ({
    fold,
    showsText: textShownIn(fold),
    open: () => fold.getByText('Open', {exact: true}).click(),
    openByKeyboard: () => index === 0
      ? focusAndPress(page, fold.getByRole('radio'), 'Space')
      : focusAndPress(page, article.getByRole('radio', {name: /^(Open|Close) /}).first(), 'ArrowDown', index),
    isOpen: () => fold.getByRole('radio').isChecked()
  })
};

const closeBarsBeforeTheParts = (build: Build): number => build === 'the radio build' ? 1 : 0;

export const accordionsTab = (page: Page) => {
  const built = (build: Build): Locator =>
    page.getByRole('article').filter({has: page.getByRole('heading', {name: headings[build], exact: true})}).first();
  const folds = (build: Build): Locator =>
    build === 'the details build' ? built(build).getByRole('group') : built(build).getByRole('listitem');
  const partOf = (build: Build, index: number): Part =>
    partIn[build]({page, fold: folds(build).nth(index + closeBarsBeforeTheParts(build)), article: built(build), index});
  return {
    partOf,
    firstPartOf: (build: Build): Part => partOf(build, 0),
    partsOf: async (build: Build): Promise<Part[]> =>
      (await folds(build).all()).slice(closeBarsBeforeTheParts(build)).map((_fold, index) => partOf(build, index))
  };
};

export const textOf = (part: Part): Locator => part.fold.getByRole('paragraph', {includeHidden: true});
