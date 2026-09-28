import type {Locator, Page} from '@playwright/test';

export type Build = 'the checkbox build' | 'the radio build' | 'the inclusive details build' | 'the details build' | 'the grid checkbox build' | 'the grid radio build';

export const builds: Build[] = ['the checkbox build', 'the radio build', 'the inclusive details build', 'the details build', 'the grid checkbox build', 'the grid radio build'];

const headings: Record<Build, string> = {
  'the checkbox build': 'Accordion using checkboxes',
  'the radio build': 'Accordion using a radio group',
  'the inclusive details build': 'Inclusive accordion using details elements',
  'the details build': 'Exclusive accordion using details elements',
  'the grid checkbox build': 'Inclusive accordion using checkboxes',
  'the grid radio build': 'Exclusive accordion using radio group'
};

export type Part = {
  fold: Locator;
  showsText: () => Promise<boolean>;
  open: () => Promise<void>;
  close: () => Promise<void>;
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
  await fold.scrollIntoViewIfNeeded();
  return text.evaluate(element => new Promise<boolean>(resolve => {
    const watch = new IntersectionObserver(([seen]) => {
      watch.disconnect();
      resolve(seen.intersectionRatio > 0);
    });
    watch.observe(element);
  }));
};

const detailsPart = (page: Page, fold: Locator): Omit<Part, 'showsText'> => ({
  fold,
  open: () => wordOn(fold).click(),
  close: () => wordOn(fold).click(),
  openByKeyboard: () => focusAndPress(page, wordOn(fold), 'Enter'),
  isOpen: () => fold.evaluate(details => details.hasAttribute('open'))
});

const pressTheBar = (fold: Locator, control: 'checkbox' | 'radio', word: 'Open' | 'Close') => () =>
  fold.getByRole(control, {name: new RegExp(`^${word} `)}).locator('..').click();

const gridCheckboxPart = (page: Page, fold: Locator): Omit<Part, 'showsText'> => ({
  fold,
  open: pressTheBar(fold, 'checkbox', 'Open'),
  close: pressTheBar(fold, 'checkbox', 'Close'),
  openByKeyboard: () => focusAndPress(page, fold.getByRole('checkbox'), 'Space'),
  isOpen: () => fold.getByRole('checkbox').isChecked()
});

const partIn: Record<Build, (where: Where) => Omit<Part, 'showsText'>> = {
  'the checkbox build': ({page, fold}) => ({
    fold,
    open: () => wordOn(fold).click(),
    close: () => wordOn(fold).click(),
    openByKeyboard: () => focusAndPress(page, fold.getByRole('checkbox'), 'Space'),
    isOpen: () => fold.getByRole('checkbox').isChecked()
  }),
  'the radio build': ({page, fold, article, index}) => ({
    fold,
    open: () => wordOn(fold).click(),
    close: () => article.getByText('Close', {exact: true}).first().click(),
    openByKeyboard: () => focusAndPress(page, article.getByRole('radio', {name: 'Close', exact: true}), 'ArrowDown', index + 1),
    isOpen: () => fold.getByRole('radio').isChecked()
  }),
  'the inclusive details build': ({page, fold}) => detailsPart(page, fold),
  'the details build': ({page, fold}) => detailsPart(page, fold),
  'the grid checkbox build': ({page, fold}) => gridCheckboxPart(page, fold),
  'the grid radio build': ({page, fold, article, index}) => ({
    fold,
    open: pressTheBar(fold, 'radio', 'Open'),
    close: pressTheBar(fold, 'radio', 'Close'),
    openByKeyboard: () => index === 0
      ? focusAndPress(page, fold.getByRole('radio'), 'Space')
      : focusAndPress(page, article.getByRole('radio', {name: /^(Open|Close) /}).first(), 'ArrowDown', index),
    isOpen: () => fold.getByRole('radio').isChecked()
  })
};

const exclusiveBuilds: Build[] = ['the radio build', 'the details build', 'the grid radio build'];

export const showing = (build: Build): string =>
  `demos/?tab=accordions&type=${exclusiveBuilds.includes(build) ? 'exclusive' : 'inclusive'}`;

const detailsBuilds: Build[] = ['the inclusive details build', 'the details build'];

const closeBarsBeforeTheParts = (build: Build): number => build === 'the radio build' ? 1 : 0;

export const accordionsTab = (page: Page) => {
  const built = (build: Build): Locator =>
    page.getByRole('article').filter({has: page.getByRole('heading', {name: headings[build], exact: true})}).first();
  const folds = (build: Build): Locator =>
    detailsBuilds.includes(build) ? built(build).getByRole('group') : built(build).getByRole('listitem');
  const partOf = (build: Build, index: number): Part => {
    const fold = folds(build).nth(index + closeBarsBeforeTheParts(build));
    return {...partIn[build]({page, fold, article: built(build), index}), showsText: textShownIn(fold)};
  };
  return {
    partOf,
    firstPartOf: (build: Build): Part => partOf(build, 0),
    partsOf: async (build: Build): Promise<Part[]> =>
      (await folds(build).all()).slice(closeBarsBeforeTheParts(build)).map((_fold, index) => partOf(build, index))
  };
};

export const textOf = (part: Part): Locator => part.fold.getByRole('paragraph', {includeHidden: true});
